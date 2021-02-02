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
    t.string("userId"),
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
      async resolve(_parent, args, context) {
        // 1. Obtain data from GitHub
        let githubUser = await requestGithubUser({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: args.code,
        });

        // Get useful info from the API
        const { id, name, avatar_url, email } = githubUser;

        // Verify is the user exists
        const user = await context.db.user.findUnique({
          where: {
            id: `${id}`,
          },
        });

        /**
         *
         * SIGN UP AND SIGN IN PROCESS
         *
         */

        if (!Boolean(user)) {
          /* The User Does Not Exist */
          /* Sign Up */
          const newGithubUser = {
            id: `${id}`,
            name: name,
            avatar: avatar_url,
            email: email,
          };

          // Add the User to the Database
          const newUser = await context.db.user.create({ data: newGithubUser });

          // Set the userId in cookie for Auth
          context.req.userSession.userId = id;

          return { userId: newUser.id, user: newUser };
        } else {
          /* Sign In the User */
          context.req.userSession.userId = id;

          return { userId: user!.id, user: user };
        }
      },
    });
  },
});
