import {
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import { Type } from './DTO/CreateVideoDto';

/*const MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(mp4|avi|mkv|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          'Only video files are allowed!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};*/
@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly prisma: PrismaService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async Upload(@UploadedFile() file: Express.Multer.File) {
    await this.prisma.$transaction(async () => {
      await this.videosService.create({
        filename: file.originalname,
        type: Type.Movie,
      });
      const stream = fs.createWriteStream(
        `FileStorage/Videos/${file.originalname}`,
      );
      stream.write(file.buffer);
    });

    return 'File uploaded successfully!';
  }

  @Get(':id')
  @Redirect('http://localhost/stream/videos/')
  async getStreamVideo(@Param('id') id: string) {
    const videoData = await this.videosService.findOne(+id);
    return { url: `http://localhost/videos/${videoData.filename}` };
  }

  @Get()
  async LoadAll() {
    return this.videosService.findAll();
  }
}
