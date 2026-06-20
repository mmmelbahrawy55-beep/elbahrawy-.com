import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common'
import { RequestsService } from './requests.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateRequestDto, UpdateRequestDto } from './dto/requests.dto'

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.requestsService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(id, updateRequestDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.requestsService.remove(id)
  }
}
