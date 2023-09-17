const express = require('express');
//installing and adding apollo server, to use as testing
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// Import necessary modules and utilities.
const db = require('./config/connection'); // Import the database connection.
const { authMiddleware } = require('./utils/auth'); // Import authentication middleware.

const { typeDefs, resolvers } = require('./schemas'); // Import GraphQL type definitions and resolvers.

// Create an Express application.
const app = express();
const PORT = process.env.PORT || 3001; // Define the port for the server to listen on.

// Create a new Apollo Server instance, specifying type definitions, resolvers, and the authentication middleware as context.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // Attach the authentication middleware to the context.
});

// Configure middleware for handling URL-encoded and JSON data.
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// If the application is in production mode, serve the static React build files.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Define a route for the root URL that serves the React client application.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/')); // Send the main HTML file of the React app.
});

// Start the Apollo Server and the Express server.
const startApolloServer = async () => {
  await server.start(); // Start the Apollo Server.

  db.once('open', () => {
    // Once the database connection is open:
    app.listen(PORT, () => {
      // Start the Express server to listen on the specified port.
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer(); // Start the Apollo Server and Express server.
