import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [PrismaModule],
})
export class PeopleModule {}
