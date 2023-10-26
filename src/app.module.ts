import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'aws.connect.psdb.cloud',
      port: 3306,
      username: 'fpl8clnkit21yhvth1jq',
      password: 'pscale_pw_Ong9HBRbNh8kpjDUiSLF8rHS2c8dgMpSaad4eqdRHfN',
      database: 'kwangsaeng_db',
      // charset: "utf8mb4",
      synchronize: false,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
