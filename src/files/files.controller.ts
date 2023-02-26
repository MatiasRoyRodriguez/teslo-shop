import { Controller, Get, Post, UploadedFile, UseInterceptors, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger/dist';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';


@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService
	) { }

	@Get('product/:imageName')
	findProductImage(
		@Res() res: Response,
		@Param('imageName') imageName: string
	) {
		const path = this.filesService.getStaticProductImage(imageName);
		res.sendFile(path);
	}

	@Post('product')
	@UseInterceptors(FileInterceptor('file', {
		fileFilter: fileFilter,
		// limits: { fileSize: 1000 }
		storage: diskStorage({
			destination: './static/products',
			filename: fileNamer
		})
	}))
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {

		if (!file) {
			throw new BadRequestException('Make sure that file is an image');
		}

		const secureUrl = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;

		return { secureUrl };
	}


}
