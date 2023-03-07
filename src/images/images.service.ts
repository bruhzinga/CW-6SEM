import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createImageDto) {
    return this.prisma.image.create({
      data: createImageDto,
    });
  }
}
