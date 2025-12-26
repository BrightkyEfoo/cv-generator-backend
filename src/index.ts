import 'dotenv/config';
import { createApp } from './app.js';
import { prisma, connectDatabase, disconnectDatabase } from './infrastructure/persistence/prisma.js';

const PORT = process.env.PORT || 3001;

async function main() {
  await connectDatabase();

  const { app, container } = createApp(prisma);

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  const shutdown = async () => {
    console.log('Shutting down...');
    server.close();
    await container.closePDFService();
    await container.closePreviewGenerator();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
