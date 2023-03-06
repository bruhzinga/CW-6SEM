import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  type: Type[];

  @Column({ type: 'varchar', nullable: false, unique: true })
  filename: string;
}

export enum Type {
  actor = 'actor',
  director = 'director',
  poster = 'poster',
}
