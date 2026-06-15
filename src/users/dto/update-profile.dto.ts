import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Taka', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nom?: string;

  @ApiProperty({ example: 'Michel', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  prenom?: string;
}