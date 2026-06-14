import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';

@Module({
  imports: [LoginModule, LogoutModule]
})
export class SecurityModule {}
