import dotenv from "dotenv";
dotenv.config("../.env");

import express from "express";
import cookieParser from "cookie-parser";

import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import { typeDefs, resolvers } from "./courseSchema";

const app = express();
app.use(cookieParser());

const checkHeaderFromRequest = (req, header, value) => {
  const v = req.headers[header];
  return v === value;
};

const checkAccessCookie = (req, name, value) => {
  const v = req.cookies[name];
  return v === value;
};

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  context: ({ req, res }) => {
    if (
      checkHeaderFromRequest(
        req,
        process.env.GATEWAY_INIT_HEADER_NAME,
        process.env.GATEWAY_INIT_HEADER_VALUE
      ) ||
      (checkHeaderFromRequest(
        req,
        "authorization",
        `Bearer ${process.env.SIGNED_ACCESS_TOKEN}`
      ) &&
        checkAccessCookie(
          req,
          process.env.SIGNED_COOKIE_NAME,
          process.env.SIGNED_COOKIE_TOKEN
        ))
    ) {
      return { req, res };
    }

    res.status(401);
    throw new Error("Not Authorized");
  },
});
apolloServer.applyMiddleware({ app, cors: false });

app.listen(process.env.COURSE_PORT);
console.log(`Server started at domain: ${process.env.COURSE_DOMAIN}`);
