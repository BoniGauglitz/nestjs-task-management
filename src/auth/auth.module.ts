import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(User);
        Object.setPrototypeOf(baseRepo, UsersRepository.prototype);
        return baseRepo;
      },
      inject: [DataSource],
    },
  ],
  controllers: [AuthController],
  exports: [UsersRepository, JwtStrategy, PassportModule],
})
export class AuthModule {}
