import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EpisodeService } from './episode.service';
import { CreateEpisodeInput } from './dto/create-episode.input';
import { UpdateEpisodeInput } from './dto/update-episode.input';
import { EpisodeModel } from './entities/episode.model';
import { PaginatedEpisodes } from './dto/paginated-episodes.result';
import { GetEpisodesArgs } from './dto/get-episodes.args';
import { ParseUUIDPipe } from '@nestjs/common';
import { SeasonModel } from '../season/entities/season.model';
import { SeasonService } from '../season/season.service';
import { SeriesService } from '../series/series.service';
import { SeriesModel } from '../series/entities/series.model';

@Resolver(EpisodeModel)
export class EpisodeResolver {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly seasonService: SeasonService,
    private readonly seriesService: SeriesService,
  ) {}

  @Mutation(() => EpisodeModel)
  createEpisode(@Args('input') input: CreateEpisodeInput) {
    return this.episodeService.create(input);
  }

  @Query(() => PaginatedEpisodes)
  getEpisodes(@Args() { searchTitle, seasonId, take, skip }: GetEpisodesArgs) {
    return this.episodeService.readAll(searchTitle, seasonId, take, skip);
  }

  @Query(() => EpisodeModel, { nullable: true })
  getEpisode(@Args('id', ParseUUIDPipe) id: string) {
    return this.episodeService.readOne(id);
  }

  @Mutation(() => EpisodeModel)
  updateEpisode(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') input: UpdateEpisodeInput,
  ) {
    return this.episodeService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteEpisode(@Args('id', ParseUUIDPipe) id: string) {
    return this.episodeService.delete(id);
  }

  @ResolveField(() => SeasonModel)
  season(@Parent() episode: EpisodeModel) {
    return this.seasonService.readOne(episode.seasonId);
  }

  @ResolveField(() => SeriesModel)
  series(@Parent() episode: EpisodeModel) {
    return this.seriesService.readOne(episode.seriesId);
  }
}