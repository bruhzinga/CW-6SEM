import { UserEntity } from 'src/users/entity/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { GenreEntity } from '../genres/entities/genre.entity';
import { GenreDto } from '../genres/dto/genre.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, role } = data;

  return {
    id,
    username,
    email,
    role,
  };
};

export const toGenreDto = (data: GenreEntity): GenreDto => {
  const { id, name } = data;

  return {
    id,
    name,
  };
};
