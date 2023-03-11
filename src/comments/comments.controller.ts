import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './DTO/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async CreateComment(
    @Req() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(req.user.id, createCommentDto);
  }
}
