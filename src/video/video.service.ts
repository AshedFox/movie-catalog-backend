import { Injectable } from '@nestjs/common';
import { VideoModel } from './entities/video.model';
import { Repository } from 'typeorm';
import { NotFoundError } from '../shared/errors/not-found.error';
import { CreateVideoInput } from './dto/create-video.input';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from '../shared/errors/already-exists.error';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoModel)
    private readonly videoRepository: Repository<VideoModel>,
  ) {}

  async create(createVideoInput: CreateVideoInput): Promise<VideoModel> {
    const existingVideo = await this.videoRepository.findOne({
      baseUrl: createVideoInput.baseUrl,
    });
    if (existingVideo) {
      throw new AlreadyExistsError(
        `Video with url "${createVideoInput.baseUrl}" already exists`,
      );
    }
    return await this.videoRepository.save(createVideoInput);
  }

  async readOne(id: string): Promise<VideoModel> {
    const video = await this.videoRepository.findOne(id);
    if (!video) {
      throw new NotFoundError();
    }
    return video;
  }

  async readAll(): Promise<VideoModel[]> {
    return this.videoRepository.find();
  }

  async readAllByIds(ids: string[]): Promise<VideoModel[]> {
    return this.videoRepository.findByIds(ids);
  }

  async delete(id: string) {
    const video = await this.videoRepository.findOne(id);
    if (!video) {
      throw new NotFoundError();
    }
    await this.videoRepository.remove(video);
    return true;
  }
}
