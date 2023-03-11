import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Param('id') id: string) {
    return this.historyService.create(req.user.id, +id);
  }
}
