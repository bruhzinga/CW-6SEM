import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoryService } from '../history/history.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, HistoryService],
  imports: [PrismaModule],
})
export class VideosModule {}
