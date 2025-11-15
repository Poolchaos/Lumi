import app from './app';
import { connectDatabase } from './config/database';
import config from './config';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start server
    app.listen(config.port, () => {
      console.warn(`Server running on port ${config.port} in ${config.node_env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
