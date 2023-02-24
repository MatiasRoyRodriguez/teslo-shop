import { Injectable } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

import { isUUID } from 'class-validator';
@Injectable()
export class ProductsService {

	private readonly logger = new Logger('ProductsService');

	constructor(

		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductImage)
		private readonly productImageRepository: Repository<ProductImage>

	) { }

	async create(createProductDto: CreateProductDto) {


		try {
			const { images = [], ...productsDetails } = createProductDto;

			const product = this.productRepository.create({
				...productsDetails,
				images: images.map(image => this.productImageRepository.create({ url: image }))
			});
			await this.productRepository.save(product);

			return {...product, images};

		} catch (error) {
			this.handleDBExceptions(error);
		}

	}

	findAll(paginationDto: PaginationDto) {

		const { limit = 10, offset = 0 } = paginationDto;

		return this.productRepository.find({
			take: limit,
			skip: offset
		});
	}

	async findOne(term: string) {

		let product: Product;

		if (isUUID(term)) {
			product = await this.productRepository.findOneBy({ id: term });
		} else {
			const queryBuilder = this.productRepository.createQueryBuilder();
			product = await queryBuilder
				.where('UPPER(title) =:title or slug =:slug', {
					title: term.toUpperCase(),
					slug: term.toLocaleLowerCase(),
				}).getOne();
		}

		if (!product)
			throw new NotFoundException(`Product with term ${term} not found`);

		return product;
	}

	async update(id: string, updateProductDto: UpdateProductDto) {

		const product = await this.productRepository.preload({
			id: id,
			...updateProductDto,
			images: []
		});

		if (!product)
			throw new NotFoundException(`Product with id: ${id} not found`);

		try {
			await this.productRepository.save(product);
		} catch (error) {
			this.handleDBExceptions(error);
		}

		return product;
	}

	async remove(id: string) {
		const product = await this.findOne(id);
		await this.productRepository.remove(product);
	}

	private handleDBExceptions(error: any) {
		if (error.code === '23505')
			throw new BadRequestException(error.detail);

		this.logger.error(error);
		throw new InternalServerErrorException('Unexpected error, check server logs');
	}

}
