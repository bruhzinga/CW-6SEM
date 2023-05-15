import { Module } from '@nestjs/common';
import { WatchLaterService } from './watch-later.service';
import { WatchLaterController } from './watch-later.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [WatchLaterController],
  providers: [WatchLaterService],
  imports: [PrismaModule],
})
export class WatchLaterModule {}
