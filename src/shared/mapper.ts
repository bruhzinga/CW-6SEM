import { UserEntity } from 'src/users/entity/user.entity';
import { UserDto } from 'src/users/dto/user.dto';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, role } = data;

  return {
    id,
    username,
    email,
    role,
  };
};
