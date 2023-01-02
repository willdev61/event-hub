import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import DefaultAdminModule from 'nestjs-admin/dist/src/defaultAdmin.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), DefaultAdminModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
