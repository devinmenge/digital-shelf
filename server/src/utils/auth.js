import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  console.log('Received token in auth.js:', token); // Debug log

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', { maxAge: '2hr' });
    console.log('Decoded token in auth.js:', decoded); // Debug log
    req.user = decoded; // Set the entire decoded payload as req.user
  } catch (err) {
    console.log('Token verification failed:', err.message); // Debug log
  }

  return req;
};

export class AuthenticationError extends GraphQLError {
  constructor(message) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};