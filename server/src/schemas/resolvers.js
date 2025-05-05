import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Secret for JWT (store this in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    signup: async (parent, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return { token, user };
    },
  },
};

export default resolvers;