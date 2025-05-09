import { User } from '../models/User.js';
import Collection from '../models/Collection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user._id);
    },
    myCollection: async (parent, args, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Collection.find({ userId: context.user._id });
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
    addGameToCollection: async (parent, { gameId, name, imageUrl }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const existingGame = await Collection.findOne({ userId: context.user._id, gameId });
      if (existingGame) throw new Error('Game already in collection');
      const newGame = await Collection.create({
        gameId,
        name,
        imageUrl,
        userId: context.user._id,
      });
      return newGame;
    },
    removeGameFromCollection: async (parent, { gameId }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const game = await Collection.findOneAndDelete({
        gameId,
        userId: context.user._id,
      });
      if (!game) throw new Error('Game not found in collection');
      return game;
    },
    updateComment: async (parent, { gameId, comment }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      console.log(`Updating comment for gameId: ${gameId}, userId: ${context.user._id}, comment: ${comment}`);
      const game = await Collection.findOneAndUpdate(
        { gameId, userId: context.user._id },
        { comment },
        { new: true }
      );
      if (!game) throw new Error('Game not found in collection');
      console.log(`Updated game: ${JSON.stringify(game)}`);
      return game;
    },
  },
};

export default resolvers;