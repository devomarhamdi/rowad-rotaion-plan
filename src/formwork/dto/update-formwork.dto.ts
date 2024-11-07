import { PartialType } from '@nestjs/mapped-types';
import { CreateFormworkDto } from './create-formwork.dto';

export class UpdateFormworkDto extends PartialType(CreateFormworkDto) {}
