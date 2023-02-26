import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

@Entity({ name: 'products' })
export class Product {

	@ApiProperty({
		example: 'f0a2b7d7-c7b8-4e65-b37e-218d8bdf6072',
		description: 'Product ID',
		uniqueItems: true
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'T-Shirt Teslo',
		description: 'Product Title',
		uniqueItems: true
	})
	@Column('text', {
		unique: true,
	})
	title: string;

	@ApiProperty({
		example: 0,
		description: 'Product Price',
	})
	@Column('float', {
		default: 0
	})
	price: number;

	@ApiProperty({
		example: 'Example description',
		description: 'Product description',
		default: null
	})
	@Column({
		type: 'text',
		nullable: true
	})
	description: string;

	@ApiProperty({
		example: 't_shirt_teslo',
		description: 'Product SLUG - for SEO',
		uniqueItems: true
	})
	@Column('text', {
		unique: true
	})
	slug: string;

	@ApiProperty({
		example: 10,
		description: 'Product stock',
		default: 0
	})
	@Column('int', {
		default: 0
	})
	stock: number;

	@ApiProperty({
		example: ['M','XL','XXL'],
		description: 'Product Sizes'
	})
	@Column('text', {
		array: true
	})
	sizes: string[];

	@ApiProperty({
		example: 'women',
		description: 'Product gender',
		default: 0
	})
	@Column('text')
	gender: string;

	@ApiProperty()
	@Column('text', {
		array: true,
		default: []
	})
	tags: string[]

	@ApiProperty()
	@OneToMany(
		() => ProductImage,
		(productImage) => productImage.product,
		{ cascade: true, eager: true }
	)
	images?: ProductImage[];


	@ManyToOne(
		() => User,
		(user) => user.product,
		{ eager: true }
	)
	user: User

	@BeforeInsert()
	checkSlugInsert() {

		if (!this.slug) {
			this.slug = this.title
		}

		this.slug = this.slug
			.toLowerCase()
			.replaceAll(' ', '_')
			.replaceAll("'", '')
	}

	@BeforeUpdate()
	checkSlugUpdate() {
		this.slug = this.slug
			.toLowerCase()
			.replaceAll(' ', '_')
			.replaceAll("'", '')
	}
}
