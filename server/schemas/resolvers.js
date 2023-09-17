// Import necessary modules and utilities.
const { AuthenticationError } = require('apollo-server-express'); // Importing an error type for authentication errors.
const { User } = require('../models'); // Importing the 'User' model for database operations.
const { signToken } = require('../utils/auth'); // Importing a utility function to sign JWT tokens.

// Define the 'resolvers' object, which contains functions to resolve GraphQL queries and mutations.
const resolvers = {
  Query: {
    // Resolver for the 'me' query to retrieve user data when authenticated.
    me: async (parent, args, context) => {
      if (context.user) {
        // If the user is authenticated (i.e., context.user exists):
        // Fetch user data from the database based on the user's ID,
        // and exclude certain fields (e.g., '__v' and 'password').
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }

      // If the user is not authenticated, throw an authentication error.
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // Resolver for the 'addUser' mutation to create a new user.
    addUser: async (parent, args) => {
      // Create a new user based on the arguments passed.
      const user = await User.create(args);

      // Sign a JWT token for the newly created user.
      const token = signToken(user);

      // Return the JWT token and the user object.
      return { token, user };
    },

    // Resolver for the 'login' mutation to authenticate a user.
    login: async (parent, { email, password }) => {
      // Find a user in the database based on the provided email.
      const user = await User.findOne({ email });

      if (!user) {
        // If no user is found, throw an authentication error.
        throw new AuthenticationError('Incorrect credentials');
      }

      // Check if the provided password matches the user's stored password.
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        // If the password is incorrect, throw an authentication error.
        throw new AuthenticationError('Incorrect credentials');
      }

      // If authentication is successful, sign a JWT token for the user and return it along with the user object.
      const token = signToken(user);
      return { token, user };
    },

    // Resolver for the 'saveBook' mutation to add a book to a user's saved books.
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        // If the user is authenticated (i.e., context.user exists):
        // Update the user's document in the database to add the book to their savedBooks array.
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        // Return the updated user object.
        return updatedUser;
      }

      // If the user is not authenticated, throw an authentication error.
      throw new AuthenticationError('You need to be logged in!');
    },

    // Resolver for the 'removeBook' mutation to remove a book from a user's saved books.
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        // If the user is authenticated (i.e., context.user exists):
        // Update the user's document in the database to remove the book from their savedBooks array.
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        // Return the updated user object.
        return updatedUser;
      }

      // If the user is not authenticated, throw an authentication error.
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

// Export the 'resolvers' object for use in your GraphQL server setup.
module.exports = resolvers;
