import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...dto,
      userId,
    });
    return this.transactionsRepository.save(transaction);
  }

  async findAll(userId: string, filters: FilterTransactionDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .orderBy('transaction.createdAt', 'DESC');

    if (filters.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }

    if (filters.startDate) {
      query.andWhere('transaction.date >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('transaction.date <= :endDate', { endDate: filters.endDate });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async summary(userId: string) {
    const { income } = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'income')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: TransactionType.INCOME })
      .getRawOne();

    const { expense } = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'expense')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: TransactionType.EXPENSE })
      .getRawOne();

    const totalIncome = Number(income) || 0;
    const totalExpense = Number(expense) || 0;

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ where: { id, userId } });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada ou você não tem permissão');
    }

    Object.assign(transaction, dto);
    return this.transactionsRepository.save(transaction);
  }

  async remove(userId: string, id: string): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({ where: { id, userId } });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada ou você não tem permissão');
    }

    await this.transactionsRepository.remove(transaction);
  }
}