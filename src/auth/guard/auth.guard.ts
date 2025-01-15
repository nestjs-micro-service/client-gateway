import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenExtracted = this.extractTokenFromHeader(request);
    if (!tokenExtracted) {
      throw new UnauthorizedException(); //We use this error and not RpcException because it will be used in the client gateway, not the microservice(REST)
    }

    try {
      //We send the token to the auth service to verify it
      const { user, token } = await firstValueFrom(
        this.client.send('auth.verify.token', tokenExtracted),
      );
      request['user'] = user;
      request['token'] = token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
