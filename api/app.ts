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

const server = new ApolloServer({ schema, context });

const app = express();

// Set a Session Cookie
app.use(
  session({
    cookieName: "session",
    secret: "cat",
    duration: 24 * 60 * 60 * 1000, // 1 Day
  })
);

server.applyMiddleware({ app, path: "/" });

app.listen(4000, () => {
  console.log(`🚀 Server ready at 4000`);
});
