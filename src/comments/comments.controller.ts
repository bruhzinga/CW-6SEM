import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './DTO/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async CreateComment(
    @Req() req: any,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(req.user.id, createCommentDto);
  }

  @Delete(':id')
  async deleteComment(@Req() req: any, @Param('id') id: string) {
    return this.commentsService.deleteComment(req.user.id, +id);
  }
}
