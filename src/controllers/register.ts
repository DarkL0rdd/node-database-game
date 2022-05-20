import { Request, Response } from "express";
import { sequelize } from "../sequelize";
import { User } from "../models/user_model";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  const user = sequelize.getRepository(User);
  /*user.create({
    first_name: req.body.first_name,
    second_name: req.body.second_name,
    email: req.body.email,
    password: req.body.password,
  });*/

  /*try {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(`${req.body.password}`, salt, function (err, hash) {
        // Store hash in your password DB.
        user.create({
          first_name: req.body.first_name,
          second_name: req.body.second_name,
          email: req.body.email,
          password: hash, //req.body.password
        });
      });
    });
  } catch (err) {
    res.end(err);
  }*/
  let hash = await bcrypt.hashSync(`${req.body.password}`, 8);

  user.create({
    first_name: req.body.first_name,
    second_name: req.body.second_name,
    email: req.body.email,
    password: hash, //req.body.password
  });

  res.send("Successful req");
};
