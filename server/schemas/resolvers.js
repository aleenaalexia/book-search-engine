const { User, User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apolloserver-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

                return userData;
            }
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect username or password');
            }
            
            const password = await user.Password(pass);

            if (!password) {
                throw new AuthenticationError('Incorrect username or password');

            }

            const token = signToken(user);
            return { token, user };

        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const addBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { addBook: bookData } },
                    { new: true }
                );

                return addBook;
            }
            throw new AuthenticationError('Please login');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const addBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                );

                return addBook;
            }

        },
    },
};

module.exports = resolvers;