import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GenreService } from './genre.service';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreModel } from './entities/genre.model';
import { PaginatedGenres } from './dto/paginated-genres.result';
import { GetGenresArgs } from './dto/get-genres.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../user/entities/role.enum';

@Resolver(GenreModel)
export class GenreResolver {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => GenreModel)
  createGenre(@Args('input') createGenreInput: CreateGenreInput) {
    return this.genreService.create(createGenreInput);
  }

  @Query(() => PaginatedGenres)
  getGenres(@Args() { searchName, take, skip }: GetGenresArgs) {
    return this.genreService.readAll(searchName, take, skip);
  }

  @Query(() => GenreModel, { nullable: true })
  getGenre(@Args('id', ParseUUIDPipe) id: string) {
    return this.genreService.readOne(id);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => GenreModel)
  updateGenre(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('input') updateGenreInput: UpdateGenreInput,
  ) {
    return this.genreService.update(id, updateGenreInput);
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Role([RoleEnum.Admin, RoleEnum.Moderator])
  @Mutation(() => Boolean)
  deleteGenre(@Args('id', ParseUUIDPipe) id: string) {
    return this.genreService.delete(id);
  }
}
