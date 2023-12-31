import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../common/guard/auth.guard';
import { RedisProvider } from 'src/providers/redis.provider';
import { CustomConfigModule } from 'src/config/custom-config.module';

@Module({
  imports: [UserModule, CustomConfigModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RedisProvider,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
