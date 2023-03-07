import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './DTO/CreateVideoDto';
import { Video } from '@prisma/client';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    return this.prisma.video.create({
      data: createVideoDto,
    });
  }

  async findAll(): Promise<Video[]> {
    return this.prisma.video.findMany();
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });
    if (!video)
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    return video;
  }
}
