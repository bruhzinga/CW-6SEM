import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [PrismaModule],
  exports: [HistoryService],
})
export class HistoryModule {}
