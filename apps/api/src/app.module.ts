import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CrmModule } from "./crm/crm.module";
import { ProjectsModule } from "./projects/projects.module";
import { MarketingModule } from "./marketing/marketing.module";
import { AiModule } from "./ai/ai.module";
import { ProductsModule } from "./products/products.module";
import { TeamModule } from "./team/team.module";
import { PortfolioModule } from "./portfolio/portfolio.module";
import { RequestsModule } from "./requests/requests.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    CrmModule,
    ProjectsModule,
    MarketingModule,
    AiModule,
    ProductsModule,
    TeamModule,
    PortfolioModule,
    RequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
