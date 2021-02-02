## Commands for Prisma

Persist the database:
`npx prisma db push`

Generate the prisma client
`npx prisma generate`

view database:
`npx prisma studio`

## Using Cookies in GraphQL Playground

Make sure to set

```json
  "request.credentials": "include",
```

This will ensure that cookies are set upon requests.
