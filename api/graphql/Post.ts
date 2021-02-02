import { extendType, nonNull, objectType, stringArg } from "nexus";
import { User } from "./User";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("body");
    t.field("author", {
      type: User,
      resolve(parent, _args, ctx) {
        return ctx.db.post
          .findUnique({ where: { id: `${parent.id}` } })
          .author();
      },
    });
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_parent, _args, ctx) {
        if (ctx.userId !== undefined) {
          return ctx.db.post.findMany({
            where: { id: ctx.userId },
          });
        } else {
          throw new Error("User now authenticated.");
        }
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        id: stringArg(),
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
        authorId: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        if (ctx.userId !== undefined) {
          const draft = {
            id: `${ctx.userId}`,
            title: args.title,
            body: args.body,
            author: { connect: { id: args.authorId } },
          };

          return ctx.db.post.create({ data: draft });
        } else {
          throw new Error("User not authenticated.");
        }
      },
    });
  },
});
