import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsIn } from 'class-validator'

export class CreateRequestDto {
  @ApiProperty({ description: 'Customer name' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Customer phone number' })
  @IsPhoneNumber('EG')
  @IsNotEmpty()
  phone: string

  @ApiProperty({ description: 'Project details' })
  @IsString()
  @IsNotEmpty()
  projectDetails: string
}

export class UpdateRequestDto {
  @ApiProperty({ description: 'Request status', enum: ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'], required: false })
  @IsOptional()
  @IsIn(['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'])
  status?: string

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string
}