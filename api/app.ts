import {ApolloServer} from "apollo-server";
import {makeSchema} from "nexus";
import {join} from "path";
import * as types from './graphql'
import { context } from './context'

const schema = makeSchema({
    types,
    outputs: {
        typegen: join(__dirname, '..', 'nexus-typegen.ts'),
        schema: join(__dirname, '...', 'schema.graphql'),
    },
    contextType: {
        module: join(__dirname, "./context.ts"),
        export: "Context"
      }
})

const server = new ApolloServer({schema, context})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
