import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/user.create.dto';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { HasRoles } from './has-roles.decorator';
import { UserDto } from '../users/dto/user.dto';
import { Role } from '../users/entities/Role';
import { Public } from './public-decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }
  @Public()
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Public()
  @Post('forgot-password')
  public async forgotPassword(@Body() body: { email: string }): Promise<any> {
    console.log(body);
    return await this.authService.forgotPassword(body.email);
  }

  @Get('whoami')
  public async testAuth(@Req() req: any): Promise<UserDto> {
    return req.user;
  }

  @Get('Admin')
  @HasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  public async Test(@Req() req: any): Promise<UserDto> {
    return req.user;
  }
}
