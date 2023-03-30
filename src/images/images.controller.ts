import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Response } from 'express';
import {Public} from "../auth/public-decorator";

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
    const stream = fs.createWriteStream(
      `FileStorage/Images/${file.originalname}`,
    );
    stream.write(file.buffer);
    return 'File uploaded successfully!';
  }

  @Get(':id')
  @Public()
  async Load(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const ImageData = await this.imagesService.findOne(+id);

    const file = createReadStream(`FileStorage/Images/${ImageData.filename}`);
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename=${ImageData.filename}`,
    });
    return new StreamableFile(file);
  }

  @Get()
  async LoadAll() {
    return this.imagesService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', MulterOptions))
  async Update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const ImageData = await this.imagesService.findOne(+id);
    if (ImageData) {
      const stream = fs.createWriteStream(
        `FileStorage/Images/${ImageData.filename}`,
      );
      stream.write(file.buffer);
      return 'File updated successfully!';
    } else {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }
}
