import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Response } from 'express';
import { createReadStream } from 'fs';

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
      await this.videosService.create({ filename: file.originalname });
      const stream = fs.createWriteStream(
        `FileStorage/Videos/${file.originalname}`,
      );
      stream.write(file.buffer);
    });

    return 'File uploaded successfully!';
  }

  /*@Get(':id')
  async Load(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const VideoData = await this.videosService.findOne(+id);
    const file = createReadStream(`FileStorage/Videos/${VideoData.filename}`);
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename=${VideoData.filename}`,
    });
    return new StreamableFile(file);
  }*/
  //TODO research how to stream video

  @Get()
  async LoadAll() {
    return this.videosService.findAll();
  }
}
