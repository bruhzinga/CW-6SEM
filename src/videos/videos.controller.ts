import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Type } from './DTO/CreateVideoDto';
import { Public } from '../auth/public-decorator';

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
      let filenameFormatted = file.originalname.replace(/ /g, '_');
      filenameFormatted = filenameFormatted.replace(/#/g, '_');
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
  @Get(':id')
  @Public()
  async getStreamVideo(@Param('id') id: string) {
    const videoData = await this.videosService.findOne(+id);
    return { url: `http://localhost/videos/${videoData.filename}` };
  }

  @Get()
  async LoadAll() {
    return this.videosService.findAll();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateVideo(
    @Param('id') id: string,
    @Body() body: { type: Type },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { type } = body;
    const VideoData = await this.videosService.findOne(+id);
    if (!VideoData)
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    this.videosService.update(+id, { type: type || VideoData.type });
    const filenameFormatted = file.originalname.replace(/ /g, '_');
    const stream = fs.createWriteStream(
      `FileStorage/Videos/${filenameFormatted}`,
    );
    stream.write(file.buffer);
    return 'File updated successfully!';
  }
}
