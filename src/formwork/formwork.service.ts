import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormworkDto, ZoneDto, ZoneLevelDto } from './dto/create-formwork.dto';
import { UpdateFormworkDto } from './dto/update-formwork.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FormworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFormworkDto: CreateFormworkDto, user) {
    return await this.prisma.formwork.create({
      data: {
        buildingName: createFormworkDto.buildingName,
        userId: user.id,
        Zones: {
          create: createFormworkDto.zones.map((zone) => {
            return {
              zoneName: zone.zoneName,
              ZoneLevels: {
                create: zone.zoneLevels.map((zoneLevel) => {
                  // Convert startDate and endDate to Date objects
                  const startDate = new Date(zoneLevel.startDate);
                  const endDate = new Date(zoneLevel.endDate);

                  return {
                    levelName: zoneLevel.levelName,
                    area: zoneLevel.area,
                    height: zoneLevel.height,
                    shoring: zoneLevel.area * zoneLevel.height,
                    system: zoneLevel.system,
                    startDate: startDate,
                    endDate: endDate,
                    // Calculate the duration in days
                    duration: Math.floor(
                      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
                    ),
                  };
                }),
              },
            };
          }),
        },
      },
    });
  }

  async findAll(user) {
    const formworks = await this.prisma.formwork.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Zones: {
          orderBy: {
            id: 'asc',
          },
          include: {
            ZoneLevels: {
              orderBy: { id: 'asc' },
            },
          },
        },
      },
    });

    const length = await this.prisma.formwork.count();

    if (!formworks || length === 0) {
      throw new NotFoundException('There are no formworks');
    }

    return {
      length,
      data: formworks,
    };
  }

  async findOne(id: number, user) {
    const isExist = await this.prisma.formwork.findUnique({
      where: { id, userId: user.id },
      include: {
        Zones: {
          include: {
            ZoneLevels: true,
          },
        },
      },
    });

    if (!isExist) {
      throw new NotFoundException('Formwork not found');
    }

    return isExist;
  }

  async update(id: number, updateFormworkDto: UpdateFormworkDto) {
    const isExist = await this.prisma.formwork.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('Formwork not found');
    }

    const formwork = await this.prisma.formwork.update({
      where: { id },
      data: {
        buildingName: updateFormworkDto.buildingName,
      },
    });

    return formwork;
  }

  async updateZone(id: number, zoneDto: ZoneDto) {
    const isExist = await this.prisma.zone.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('Zone not found');
    }

    const formwork = await this.prisma.zone.update({
      where: { id },
      data: {
        zoneName: zoneDto.zoneName,
      },
    });

    return formwork;
  }

  async updateZoneLevel(id: number, zoneLevelDto: ZoneLevelDto) {
    const isExist = await this.prisma.zoneLevel.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('ZoneLevel not found');
    }

    let shoring;
    let duration;

    if (zoneLevelDto.area && zoneLevelDto.height) {
      shoring = zoneLevelDto.area * zoneLevelDto.height;
    }

    if (zoneLevelDto.startDate && zoneLevelDto.endDate) {
      const startDate = new Date(zoneLevelDto.startDate);
      const endDate = new Date(zoneLevelDto.endDate);
      duration = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    const formwork = await this.prisma.zoneLevel.update({
      where: { id },
      data: {
        levelName: zoneLevelDto.levelName,
        area: zoneLevelDto.area,
        height: zoneLevelDto.height,
        system: zoneLevelDto.system,
        startDate: zoneLevelDto.startDate
          ? new Date(zoneLevelDto.startDate)
          : isExist.startDate,
        endDate: zoneLevelDto.endDate ? new Date(zoneLevelDto.endDate) : isExist.endDate,
        shoring,
        duration,
      },
    });

    return formwork;
  }

  async remove(id: number) {
    const isExist = await this.prisma.formwork.findUnique({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('Formwork not found');
    }

    const formwork = await this.prisma.formwork.delete({
      where: { id },
    });

    return formwork;
  }
}
