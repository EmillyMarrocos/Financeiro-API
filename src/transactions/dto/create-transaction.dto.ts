import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsDateString } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsDateString()
  @IsOptional()
  date?: string;
}