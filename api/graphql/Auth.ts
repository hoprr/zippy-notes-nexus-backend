import { extendType, nonNull, objectType, stringArg } from "nexus";
import requestGithubUser from "../utils/auth/github";

export const githubLoginUrl = objectType({
  name: "githubLoginUrl",
  definition(t) {
    t.string("githubLoginUrl");
  },
});

export const githubLoginUrlQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("githubLoginUrl", {
      type: "String",
      resolve() {
        return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`;
      },
    });
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("githubToken"),
      t.field("user", {
        type: "User",
      });
  },
});

export const authorizeWithGithub = extendType({
  type: "Mutation",
  definition(t) {
    t.field("AuthorizeWithGithub", {
      type: "AuthPayload",
      args: {
        code: nonNull(stringArg()),
      },
      async resolve(_parent, args) {
        // 1. Obtain data from GitHub
        let githubUser = await requestGithubUser({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: args.code,
        });

        const { name, login, avatar, email } = githubUser;

        const user = {
          name,
          login,
          avatar,
          email,
        };

        return { user };
      },
    });
  },
});
