import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AppRoles } from 'src/app.roles';

export class ActivateDto {
  @IsBoolean()
  @ApiProperty()
  activate: boolean;
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  login: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsEnum(AppRoles)
  @ApiProperty({
    description: 'Роль пользователя',
    enum: AppRoles,
  })
  role: AppRoles;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;
}
