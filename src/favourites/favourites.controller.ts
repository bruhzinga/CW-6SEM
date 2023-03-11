import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Post(':movieId')
  @UseGuards(AuthGuard('jwt'))
  async createFavourite(@Req() req, @Param('movieId') movieId: string) {
    return this.favouritesService.createFavourite(+movieId, req.user.id);
  }
}
