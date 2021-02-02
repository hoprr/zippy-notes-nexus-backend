import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeSchema } from "nexus";
import * as dotenv from "dotenv";
import { join } from "path";
import session from "client-sessions";

import * as types from "./graphql";
import { context } from "./context";

dotenv.config();

const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "...", "schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
});

const app = express();

// Set a Session Cookie
// Can be accessed by req.session.userId
// @TODO Make Secret Stronger
// @TODO Set secure: true when in prod OR set up proxy
app.use(
  session({
    cookieName: "userSession",
    secret: "cat",
    duration: 28 * 24 * 60 * 60 * 1000, // 28 Days
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 Days
      // secure: true,
    },
  })
);

const server = new ApolloServer({ schema, context });

server.applyMiddleware({ app, path: "/", cors: false });

app.listen(4000, () => {
  console.log(`🚀 Server ready at 4000`);
});
