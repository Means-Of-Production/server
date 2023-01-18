import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import * as fs from 'fs'
import bodyParser from 'body-parser'
import passport from "passport"
import { GraphQLLocalStrategy, buildContext } from "graphql-passport"
import session from 'express-session';

import {resolvers} from "./resolvers/index.js"
import {context} from "./context.js"
import {MyContext} from "./MyContext.js"
import User from "./User.js"

const typeDefs = fs.readFileSync('schema.graphql').toString()
const SESSION_SECRECT = 'bad secret';

passport.use(
    new GraphQLLocalStrategy((email, password, done) => {
        // Adjust this callback to your needs
        const users = User.getUsers()
        const matchingUser = users.find(
            user => email === user.email && password === user.password
        );
        const error = matchingUser ? null : new Error("no matching user");
        done(error, matchingUser);
    })
);

// Required logic for integrating with Express
const app = express();

app.use(session({
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())


// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
        context: async ({ req, res}) => {
            return buildContext({req, res, connection: null, payload: null, context})
    }}
))

const PORT = 4000
app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});