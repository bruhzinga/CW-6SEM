import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpException,
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

const MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'mp4') {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          'Only mp4 files are allowed!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly prisma: PrismaService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async Upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { type: Type },
  ) {
    const { type } = body;
    await this.prisma.$transaction(async () => {
      const filenameFormatted = file.originalname.replace(/ /g, '_');
      await this.videosService.create({
        filename: filenameFormatted,
        type: type || Type.Movie,
      });
      const stream = fs.createWriteStream(
        `FileStorage/Videos/${filenameFormatted}`,
      );
      stream.write(file.buffer);
    });

    return 'File uploaded successfully!';
  }

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
