import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Global Pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  // CORS
  app.enableCors({
    origin: [
      configService.get("CORS_ORIGIN"),
      "http://localhost:3000",
      "http://localhost:3001",
    ].filter(Boolean),
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix("api");

  const port = configService.get("API_PORT") || configService.get("PORT") || 3001;
  await app.listen(port);
  console.log(`🚀 ALBAHRAWY OS API is running on: ${await app.getUrl()}`);
}

bootstrap();
