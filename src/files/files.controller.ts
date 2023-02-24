import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { BadRequestException } from '@nestjs/common/exceptions';


@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) { }

	@Post('product')
	@UseInterceptors(FileInterceptor('file', {
		fileFilter: fileFilter
	}))
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		
		if(!file){
			throw new BadRequestException('Make sure that file is an image');
		}

		return { fileName: file.originalname };
	}
}
