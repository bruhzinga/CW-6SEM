import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Redirect,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { Type } from './DTO/CreateVideoDto';
import { Public } from '../auth/public-decorator';
import {HasRoles} from "../auth/has-roles.decorator";
import {Role} from "../users/entities/Role";
import {RolesGuard} from "../auth/roles.guard";

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
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async Upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { type: Type },
  ) {
    const { type } = body;
    return await this.prisma.$transaction(async () => {
      let filenameFormatted = file.originalname.replace(/ /g, '_');
      filenameFormatted = filenameFormatted.replace(/#/g, '_');
      const result = await this.videosService.create({
        filename: filenameFormatted,
        type: type || Type.Movie,
      });
      try {
        const stream = fs.createWriteStream(
          `FileStorage/Videos/${filenameFormatted}`,
        );
        stream.write(file.buffer);
      } catch (e) {
        throw new HttpException(
          'Error creating file',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    });
  }

  @Redirect('http://localhost/stream/videos/')
  @Get(':id')
  @Public()
  async getStreamVideo(@Param('id', ParseIntPipe) id: number) {
    const videoData = await this.videosService.findOne(+id);
    return { url: `http://localhost/videos/${videoData.filename}` };
  }

  @Get()
  async LoadAll() {
    return this.videosService.findAll();
  }

  @Delete(':id')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteVideoAndUnlink(@Param('id') id: string) {
    const videoData = await this.videosService.findOne(+id);
    if (videoData) {
      await this.videosService.remove(+id);
      fs.unlink(`FileStorage/Videos/${videoData.filename}`, (err) => {
        if (err) {
          throw new HttpException(
            'Error deleting file',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    } else {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
  }


}
