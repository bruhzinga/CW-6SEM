import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreEntity } from './entities/genre.entity';
import { GenreDto } from './dto/genre.dto';
import { toGenreDto } from '../shared/mapper';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly userRepo: Repository<GenreEntity>,
  ) {}
  async create(createGenreDto: CreateGenreDto): Promise<GenreDto> {
    const Genre = await this.userRepo.create(createGenreDto);
    await this.userRepo.save(Genre);
    return toGenreDto(Genre);
  }

  async findAll(): Promise<GenreDto[]> {
    return await this.userRepo.find();
  }

  async findOne(id: number): Promise<GenreDto> {
    const Genre = await this.userRepo.findOneBy({ id });
    if (!Genre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
    return toGenreDto(Genre);
  }

  async update(id: number, updateGenreDto: CreateGenreDto) {
    return await this.userRepo.update(id, updateGenreDto);
  }

  async remove(id: number) {
    return await this.userRepo.delete(id);
  }
}
