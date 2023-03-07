import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
const MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
};

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', MulterOptions))
  async Upload(@UploadedFile() file: Express.Multer.File) {
    await this.imagesService.create({ filename: file.originalname });
    const stream = fs.createWriteStream(`FileStorage/${file.originalname}`);
    stream.write(file.buffer);
    return 'File uploaded successfully!';
  }
}
