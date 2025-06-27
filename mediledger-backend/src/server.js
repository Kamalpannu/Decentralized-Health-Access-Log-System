const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const http = require('http');
const checkJwt = require('./auth');
require('dotenv').config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();
app.use(checkJwt);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { user: req.user };
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });
  http.createServer(app).listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
