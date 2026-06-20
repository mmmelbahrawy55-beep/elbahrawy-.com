import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@albahrawy/database'
import { CreateRequestDto, UpdateRequestDto } from './dto/requests.dto'

@Injectable()
export class RequestsService {
  constructor() {}

  async create(data: CreateRequestDto) {
    return prisma.request.create({ data })
  }

  async findAll() {
    return prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
      where: { deletedAt: null },
    })
  }

  async findOne(id: string) {
    const request = await prisma.request.findUnique({ where: { id } })
    if (!request) throw new NotFoundException(`Request with ID ${id} not found`)
    return request
  }

  async update(id: string, data: UpdateRequestDto) {
    await this.findOne(id)
    return prisma.request.update({ where: { id }, data })
  }

  async remove(id: string) {
    await this.findOne(id)
    return prisma.request.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}
