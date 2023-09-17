// Import the 'typeDefs' and 'resolvers' modules from separate files.
const typeDefs = require('./typeDefs'); // These define your GraphQL schema.
const resolvers = require('./resolvers'); // These define the logic for your GraphQL queries and mutations.

// Export an object that contains 'typeDefs' and 'resolvers'.
module.exports = {
  typeDefs,    // This includes your GraphQL type definitions and schema.
  resolvers,   // These include the resolver functions for your GraphQL queries and mutations.
};
