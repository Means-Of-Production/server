
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import * as fs from 'fs'
import bodyParser from 'body-parser'
import {GraphQLError} from "graphql"
import {resolvers} from "./resolvers/index.js"
import {IContext, context} from "./context.js"


// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const typeDefs = fs.readFileSync('schema.graphql').toString()



// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
        context: async ({ req }) => {
            // get the user token from the headers
            const token = req.headers.authorization || '';

            // try to retrieve a user with the token
            const user = await context.authenticationService.getFromToken(token)

            // optionally block the user
            // we could also check user roles/permissions here
            if (!user)
                // throwing a `GraphQLError` here allows us to specify an HTTP status code,
                // standard `Error`s will have a 500 status code by default
                throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                });

            // add the user to the context
            context.user = user
            return context
    }}
))

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);