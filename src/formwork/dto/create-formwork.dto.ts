import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateFormworkDto {
  @IsString()
  buildingName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ZoneDto)
  zones: ZoneDto[];
}

export class ZoneDto {
  @IsString()
  zoneName: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ZoneLevelDto)
  zoneLevels: ZoneLevelDto[];
}

export class ZoneLevelDto {
  @IsOptional()
  @IsString()
  levelName: string;

  @IsOptional()
  @IsNumber()
  area: number;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsString()
  system: string;

  @IsOptional()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;
}
