import {
	Controller, Get, Post, Body, Patch, Param, Delete,
	ParseUUIDPipe, Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { User } from '../auth/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger/dist/decorators';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
// @Auth()
export class ProductsController {
	constructor(private readonly productsService: ProductsService) { }

	@Post()
	@Auth()
	@ApiResponse({ status: 201, description: 'Product was created', type: Product })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 403, description: 'Forbidden. Token related' })
	create(
		@Body() createProductDto: CreateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.create(createProductDto, user);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.productsService.findAll(paginationDto);
	}

	@Get(':term')
	findOne(@Param('term') id: string) {
		return this.productsService.findOnePlain(id);
	}

	@Patch(':id')
	@Auth()
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user: User,
	) {
		return this.productsService.update(id, updateProductDto, user);
	}

	@Delete(':id')
	@Auth(ValidRoles.admin)
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id);
	}
}
