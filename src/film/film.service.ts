import { Injectable } from '@nestjs/common';
import { CreateFilmInput } from './dto/create-film.input';
import { FilmModel } from './entities/film.model';
import { ILike, Repository } from 'typeorm';
import { UpdateFilmInput } from './dto/update-film.input';
import { PaginatedFilms } from './dto/paginated-films.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { FilmGenreService } from '../film-genre/film-genre.service';
import { FilmStudioService } from '../film-studio/film-studio.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmModel)
    private readonly filmRepository: Repository<FilmModel>,
    private readonly filmGenreService: FilmGenreService,
    private readonly filmStudioService: FilmStudioService,
  ) {}

  async create(createFilmInput: CreateFilmInput): Promise<FilmModel> {
    const film = await this.filmRepository.save(createFilmInput);
    const { genresIds, studiosIds } = createFilmInput;
    if (genresIds && genresIds.length > 0) {
      await this.filmGenreService.createFilmGenres(film.id, genresIds);
    }
    if (studiosIds && studiosIds.length > 0) {
      await this.filmStudioService.createFilmStudios(film.id, studiosIds);
    }
    return film;
  }

  async readAll(
    title: string,
    take: number,
    skip: number,
  ): Promise<PaginatedFilms> {
    const [data, count] = await this.filmRepository.findAndCount({
      where: [
        title
          ? {
              title: ILike(`%${title}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        publicationDate: 'DESC',
        title: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readAllByIds(ids: string[]): Promise<FilmModel[]> {
    return await this.filmRepository.findByIds(ids);
  }

  async readOne(id: string): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(id);
    if (!film) {
      throw new NotFoundError();
    }
    return film;
  }

  async update(
    id: string,
    updateFilmInput: UpdateFilmInput,
  ): Promise<FilmModel> {
    const film = await this.filmRepository.findOne(id);
    if (!film) {
      throw new NotFoundError();
    }
    return this.filmRepository.save({
      ...film,
      ...updateFilmInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const film = await this.filmRepository.findOne(id);
    if (!film) {
      throw new NotFoundError();
    }
    await this.filmRepository.remove(film);
    return true;
  }
}
