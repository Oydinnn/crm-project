import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool} from 'pg'

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{

  constructor(){
    const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:admin@localhost:5433/crm'
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    super({
      adapter,
      log: ['error', 'warn']
    })
  }

  async onModuleInit() {
    await this.$connect()
    Logger.log("✅Prisma connected")
  }
  async onModuleDestroy() {
    await this.$disconnect()
    Logger.log("⛔️Prisma disconnected")
  }
}