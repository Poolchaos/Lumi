import dotenv from 'dotenv';

dotenv.config();

interface Config {
  node_env: string;
  port: number;
  mongodb_uri: string;
  jwt_secret: string;
  jwt_expires_in: string;
  jwt_refresh_secret: string;
  jwt_refresh_expires_in: string;
  openai_api_key: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  aws_s3_bucket: string;
  cors_origin: string;
}

const config: Config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/personalfit',
  jwt_secret: process.env.JWT_SECRET || '',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '24h',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  openai_api_key: process.env.OPENAI_API_KEY || '',
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || '',
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || '',
  aws_region: process.env.AWS_REGION || 'us-east-1',
  aws_s3_bucket: process.env.AWS_S3_BUCKET || '',
  cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

// Validate required environment variables in production
if (config.node_env === 'production') {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'MONGODB_URI',
    'OPENAI_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

export default config;
