import { Injectable } from '@nestjs/common';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';
import { GenreModel } from './entities/genre.model';
import { ILike, Repository } from 'typeorm';
import { PaginatedGenres } from './dto/paginated-genres.result';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreModel)
    private readonly genreRepository: Repository<GenreModel>,
  ) {}

  async create(createGenreInput: CreateGenreInput): Promise<GenreModel> {
    return this.genreRepository.save(createGenreInput);
  }

  async readAll(
    name: string,
    take: number,
    skip: number,
  ): Promise<PaginatedGenres> {
    const [data, count] = await this.genreRepository.findAndCount({
      where: [
        name
          ? {
              name: ILike(`%${name}%`),
            }
          : {},
      ],
      take,
      skip,
      order: {
        name: 'ASC',
      },
    });

    return { data, count, hasNext: count >= take + skip };
  }

  async readAllByIds(ids: string[]): Promise<GenreModel[]> {
    return await this.genreRepository.findByIds(ids);
  }

  async readOne(id: string): Promise<GenreModel> {
    const genre = await this.genreRepository.findOne(id);
    if (!genre) {
      throw new NotFoundError();
    }
    return genre;
  }

  async update(
    id: string,
    updateGenreInput: UpdateGenreInput,
  ): Promise<GenreModel> {
    const genre = await this.genreRepository.findOne(id);
    if (!genre) {
      throw new NotFoundError();
    }
    return this.genreRepository.save({
      ...genre,
      ...updateGenreInput,
    });
  }

  async delete(id: string): Promise<boolean> {
    const genre = await this.genreRepository.findOne(id);
    if (!genre) {
      throw new NotFoundError();
    }
    await this.genreRepository.remove(genre);
    return true;
  }
}
