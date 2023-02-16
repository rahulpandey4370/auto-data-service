import { Module } from '@nestjs/common';
import { SampleAppController } from './app.controller';
import { AutoDataModuleLib } from '@yml/npm-auto-data';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    AutoDataModuleLib,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
  controllers: [SampleAppController],
  providers: [],
})
export class AppModule {}
