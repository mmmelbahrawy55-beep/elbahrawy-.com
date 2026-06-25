@echo off
cd packages\database
set DATABASE_URL=postgresql://neondb.owner:npgY8qt2gvcKirf@ep-aged-bird-apher4ma-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
set DIRECT_URL=postgresql://neondb.owner:npgY8qt2gvcKirf@ep-aged-bird-apher4ma-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
npx prisma db push
npx prisma db seed
pause
