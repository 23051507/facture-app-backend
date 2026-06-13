import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'AncienMotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  ancien_mot_de_passe: string;

  @ApiProperty({ example: 'NouveauMotDePasse123!' })
  @IsString()
  @MinLength(8)
  nouveau_mot_de_passe: string;
}