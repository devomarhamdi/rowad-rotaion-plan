import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FormworkService } from './formwork.service';
import { CreateFormworkDto, ZoneDto, ZoneLevelDto } from './dto/create-formwork.dto';
import { UpdateFormworkDto } from './dto/update-formwork.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('formwork')
export class FormworkController {
  constructor(private readonly formworkService: FormworkService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFormworkDto: CreateFormworkDto, @Request() req) {
    return this.formworkService.create(createFormworkDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.formworkService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.formworkService.findOne(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormworkDto: UpdateFormworkDto) {
    return this.formworkService.update(+id, updateFormworkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/zone/:id')
  updateZone(@Param('id') id: string, @Body() zoneDto: ZoneDto) {
    return this.formworkService.updateZone(+id, zoneDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/zone/level/:id')
  updateZoneLevel(@Param('id') id: string, @Body() zoneLevelDto: ZoneLevelDto) {
    return this.formworkService.updateZoneLevel(+id, zoneLevelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formworkService.remove(+id);
  }
}
