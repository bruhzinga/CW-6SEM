import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Type } from './entities/image.entity';
import * as fs from 'fs';
const MulterOptions = () => {
  return {
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  };
};

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('actor')
  @UseInterceptors(FileInterceptor('file', MulterOptions()))
  async uploadActor(@UploadedFile() file: Express.Multer.File) {
    const image = {
      filename: file.originalname,
      type: Type.actor,
    };
    await this.imagesService.create(image);
    const stream = fs.createWriteStream(
      `FileStorage/${Type.actor}/${file.originalname}`,
    );
    stream.write(file.buffer);
    return 'File uploaded successfully!';
  }
  @Post('director')
  @UseInterceptors(FileInterceptor('file', MulterOptions()))
  async uploadDirector(@UploadedFile() file: Express.Multer.File) {
    const image = {
      filename: file.filename,
      type: Type.director,
    };
    await this.imagesService.create(image);
    const stream = fs.createWriteStream(
      `FileStorage/${Type.director}/${file.originalname}`,
    );
    stream.write(file.buffer);
    return 'File uploaded successfully!';
  }
  @Post('poster')
  @UseInterceptors(FileInterceptor('file', MulterOptions()))
  async uploadPoster(@UploadedFile() file: Express.Multer.File) {
    const image = {
      filename: file.filename,
      type: Type.poster,
    };
    await this.imagesService.create(image);
    const stream = fs.createWriteStream(
      `FileStorage/${Type.poster}/${file.originalname}`,
    );
    stream.write(file.buffer);
    return 'File uploaded successfully!';
  }
}
