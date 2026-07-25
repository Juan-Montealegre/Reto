import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user/:username')
  async getGitHubProfile(@Param('username') username: string) {
    return this.appService.getGitHubProfile(username);
  }
}
