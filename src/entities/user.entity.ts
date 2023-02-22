import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AppRoles } from 'src/app.roles';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ nullable: true })
  public name: string;

  @IsString()
  @IsEnum(AppRoles)
  @Column({ nullable: true, default: 'user' })
  public role: AppRoles;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  @Column({ unique: true })
  public login: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  public password: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  public refreshToken: string;

  @IsBoolean()
  @IsOptional()
  @Column({ name: 'is_active', default: true })
  public isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  public deletedAt?: Date;
}
