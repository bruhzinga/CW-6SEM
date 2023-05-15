import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { WatchLaterService } from './watch-later.service';

@Controller('watch-later')
export class WatchLaterController {
  constructor(private readonly watchLaterService: WatchLaterService) {}

  @Post(':movieId')
  async createWatchLater(@Req() req, @Param('movieId') movieId: string) {
    return this.watchLaterService.createWatchLater(+movieId, req.user.id);
  }

  @Delete(':movieId')
  async deleteWatchLater(@Req() req, @Param('movieId') movieId: string) {
    return this.watchLaterService.deleteWatchLater(+movieId, req.user.id);
  }

  @Get()
  async getWatchLater(@Req() req) {
    return this.watchLaterService.getWatchLater(req.user.id);
  }
}
