import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonModel } from './entities/season.model';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonModel])],
  providers: [SeasonResolver, SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
