import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt_expires_in as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt_secret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt_refresh_secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt_secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt_refresh_secret) as TokenPayload;
};
