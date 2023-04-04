import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post(':id')
  async create(
    @Req() req,
    @Body() body: { progress: number },
    @Param('id') id: string,
  ) {
    return this.historyService.create(req.user.id, +id, body.progress);
  }

  @Get(':movieId')
  async getHistory(@Req() req, @Param('movieId') movieId: string) {
    return this.historyService.getHistoryById(req.user.id, +movieId);
  }
  @Get()
  async getHistoryByUser(@Req() req) {
    return this.historyService.getHistoryByUser(req.user.id);
  }
}
