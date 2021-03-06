import DataLoader from 'dataloader';
import { EmailConfirmationModel } from '../email/entities/email-confirmation.model';
import { SeriesModel } from '../series/entities/series.model';
import { FilmModel } from '../film/entities/film.model';
import { PersonModel } from '../person/entities/person.model';
import { SeasonModel } from '../season/entities/season.model';
import { UserModel } from '../user/entities/user.model';
import { VideoModel } from '../video/entities/video.model';
import { CountryModel } from '../country/entities/country.model';
import { StudioModel } from '../studio/entities/studio.model';
import { FilmPersonModel } from '../film-person/entities/film-person.model';
import { SeriesPersonModel } from '../series-person/entities/series-person.model';
import { GenreModel } from '../genre/entities/genre.model';
import { EpisodeModel } from '../episode/entities/episode.model';
import { QualityModel } from '../quality/entities/quality.model';

export interface IDataLoaders {
  countryLoader: DataLoader<number, CountryModel>;
  countriesByStudioLoader: DataLoader<number, CountryModel[]>;
  emailConfirmationLoader: DataLoader<string, EmailConfirmationModel>;
  episodesBySeriesLoader: DataLoader<string, EpisodeModel[]>;
  episodesBySeasonLoader: DataLoader<string, EpisodeModel[]>;
  filmLoader: DataLoader<string, FilmModel>;
  filmPersonsByFilmLoader: DataLoader<string, FilmPersonModel[]>;
  genreLoader: DataLoader<string, GenreModel>;
  genresByFilmLoader: DataLoader<string, GenreModel[]>;
  genresBySeriesLoader: DataLoader<string, GenreModel[]>;
  personLoader: DataLoader<number, PersonModel>;
  qualityLoader: DataLoader<number, QualityModel>;
  qualitiesByVideoLoader: DataLoader<string, QualityModel[]>;
  seasonLoader: DataLoader<string, SeasonModel>;
  seasonsBySeriesLoader: DataLoader<string, SeasonModel[]>;
  seriesLoader: DataLoader<string, SeriesModel>;
  seriesPersonsBySeriesLoader: DataLoader<string, SeriesPersonModel[]>;
  studioLoader: DataLoader<number, StudioModel>;
  studiosByFilmLoader: DataLoader<string, StudioModel[]>;
  studiosBySeriesLoader: DataLoader<string, StudioModel[]>;
  userLoader: DataLoader<string, UserModel>;
  videoLoader: DataLoader<string, VideoModel>;
}
