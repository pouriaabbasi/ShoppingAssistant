import jsonwebtoken from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
  const jwtToken = req.header("authorization");
  if (!jwtToken)
    return res
      .status(401)
      .send("You don't have allow to access this resource!");

  try {
    jsonwebtoken.verify(jwtToken.replace("Bearer ", ""), "123123123");
  } catch (error) {
    return res.status(400).send("JWT token is not valid!");
  }

  next();
}

export default auth;
