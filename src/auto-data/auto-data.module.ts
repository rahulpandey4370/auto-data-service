import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutoDataServiceLib } from './auto-data.service';

@Module({
  imports: [],
  providers: [ConfigService, AutoDataServiceLib],
  controllers: [],
  exports: [AutoDataServiceLib],
})
export class AutoDataModuleLib {}
