import {
  Controller,
  Delete,
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
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Public } from '../auth/public-decorator';
import { PrismaService } from '../prisma/prisma.service';

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
  constructor(
    private readonly imagesService: ImagesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', MulterOptions))
  async Upload(@UploadedFile() file: Express.Multer.File) {
    return await this.prisma.$transaction(async () => {
      const filenameFormatted = file.originalname
        .replace(/ /g, '_')
        .replace(/#/g, '_');
      const result = await this.imagesService.create({
        filename: filenameFormatted,
      });
      const stream = fs.createWriteStream(
        `FileStorage/Images/${filenameFormatted}`,
      );
      stream.write(file.buffer);
      return result;
    });
  }

  @Get(':id')
  @Public()
  async Load(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const ImageData = await this.imagesService.findOne(+id);

    const file = createReadStream(`FileStorage/Images/${ImageData.filename}`);
    const extension = ImageData.filename.split('.').pop();
    res.set({
      'Content-Type': `image/${extension}`,
      'Content-Disposition': `attachment; filename=${ImageData.filename}`,
    });
    return new StreamableFile(file);
  }

  @Get()
  async LoadAll() {
    return this.imagesService.findAll();
  }

  /*  @Patch(':id')
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
  }*/

  @Delete(':id')
  async Delete(@Param('id') id: string) {
    const ImageData = await this.imagesService.findOne(+id);
    if (ImageData) {
      await this.imagesService.remove(+id);
      fs.unlink(`FileStorage/Images/${ImageData.filename}`, (err) => {
        if (err) {
          throw new HttpException(
            'Error deleting file',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
      return JSON.stringify({ message: 'File deleted successfully!' });
    }
  }
}
