import { Controller, Post, Get, Inject, Body, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { User } from './decorators/user.decorator';
import { CurrentUser } from './interface/user.interface';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = await firstValueFrom(
        this.client.send('auth.register.user', registerUserDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await firstValueFrom(
        this.client.send('auth.login.user', loginUserDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  async verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }
}
