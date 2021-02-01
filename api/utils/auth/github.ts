import fetch from "node-fetch";

/*
1. requestGithubToken: Get the GitHub Token

    - GitHub takes our credentials
                       ^^^^^^^^^^^
    - credentials = { client_id, client_secret, code }
                                                ^^^^
    - Code - Comes from the frontend through a mutation
           - Code is user specific

    - client_id and client_secret are in our environment variables

    - client_id and client_secret are verified.

    - a user specific access_token is returned.

2. requestGithubUserAccount: Request GitHub User Account

     - We use the *user* specific access_token to get data about the user.

     - The data consists of a user id which uniquely identifies the user.
*/
interface Credentials {
  client_id: string | undefined;
  client_secret: string | undefined;
  code: string | undefined;
}

const requestGithubToken = (credentials: Credentials) =>
  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .catch((error?: string) => {
      throw new Error(JSON.stringify(error));
    });

const requestGithubUserAccount = (token: string) =>
  fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((error?: string) => JSON.stringify(error));

const requestGithubUser = async (credentials: Credentials) => {
  // const { access_token } = await requestGithubToken(credentials);
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
};

export default requestGithubUser;
