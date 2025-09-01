import app from './app.js';
import { connectDB } from './utils/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Payroll API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((e) => {
  console.error('Failed to start server', e);
  process.exit(1);
});
