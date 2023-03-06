import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class GenreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true }) name: string;
}
