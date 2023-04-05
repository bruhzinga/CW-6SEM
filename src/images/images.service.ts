import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Image } from '@prisma/client';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createImageDto) {
    return this.prisma.image.create({
      data: createImageDto,
    });
  }

  async findOne(number: number) {
    const image = await this.prisma.image.findUnique({
      where: { id: number },
    });
    if (!image)
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    return image;
  }

  findAll() {
    return this.prisma.image.findMany();
  }

  async remove(id: number) {
    const image = await this.prisma.image.findUnique({
      where: { id: id },
    });
    if (!image)
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    return this.prisma.image.delete({
      where: { id: id },
    });
  }
}
