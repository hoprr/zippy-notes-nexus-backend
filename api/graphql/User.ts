import { extendType, objectType } from "nexus";
import { Post } from "./Post";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("email");
    t.list.field("posts", {
      type: Post,
      resolve(parent, _args, ctx) {
        return ctx.db.user
          .findUnique({ where: { id: `${parent.id}` } })
          .posts();
      },
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: "User",
      resolve(_parent, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
  },
});
