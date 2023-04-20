import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket, WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import { CommentsService } from '../comments/comments.service';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway()


export class MovieCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  @WebSocketServer()
  server: Server;
  constructor(
    private readonly commentsService: CommentsService,
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
  ) {}
  private logger: Logger = new Logger('SocketLogger');

  afterInit() {
    this.logger.log('Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('comments:get')
  async fetchComments(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const rawData = await this.moviesService.GetComments(+data);

      client.emit('comments:received', rawData);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage('comments:add')
  async addComment(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(data);
      const userID = await this.usersService.findIDbyLogin(data.username);
      const comment = await this.commentsService.createComment(
        userID,
        data.comment,
      );
      this.logger.log(comment);
      this.server.emit('comment:added', comment);
    } catch (error) {
      client.emit(
        'comment:error',
        'You already posted a review. Please delete the previous review.',
      );
      this.logger.error(error);
    }
  }

  @SubscribeMessage('comments:delete')
  async deleteComment(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userID = await this.usersService.findIDbyLogin(data.username);
      await this.commentsService.deleteComment(userID, data.commentId);
      this.server.emit('comment:deleted', data.commentId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
