import { UserEntity } from 'users/entity/user.entity';
import { UserDto } from 'users/dto/user.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email } = data;

  return {
    id,
    username,
    email,
  };
};
