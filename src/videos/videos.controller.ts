import {
  Controller,
  Get,
  Header,
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
import { createReadStream, statSync } from 'fs';
import { Headers } from '@nestjs/common';

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

  @Get(':id')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getStreamVideo(
    @Param('id') id: string,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const VideoData = await this.videosService.findOne(+id);
    const videoPath = `FileStorage/Videos/${VideoData.filename}`;
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 120,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
    }
  }

  @Get()
  async LoadAll() {
    return this.videosService.findAll();
  }
}
