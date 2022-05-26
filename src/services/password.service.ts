import { sequelize } from "../sequelize";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
const userSequelize = sequelize.getRepository(User);

export const hashUserPassword = async (
  reqPassword: string,
  salRounds: number
) => {
  try {
    if (reqPassword) {
      return await bcrypt.hashSync(reqPassword, salRounds);
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

const findUserPassword = async (reqEmail: string) => {
  try {
    const emailFind = await userSequelize.findOne({
      where: { email: reqEmail },
    });
    if (emailFind?.email) {
      return emailFind.password;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

export const compareUserPassword = async (
  reqEmail: string,
  reqPassword: string
) => {
  try {
    const dbUserPassword = await findUserPassword(reqEmail);
    if (dbUserPassword) {
      const hashCompare: boolean = await bcrypt.compareSync(
        reqPassword,
        dbUserPassword
      );
      return hashCompare;
    }
  } catch (err) {
    console.log(err);
  }
};

/*export const forgotPassword = async (req: Request, res: Response) => {
  const userFind = await userSequelize.findOne({
    where: { email: req.body.email },
  });

  if (!userFind) {
    res.status(400).send(`User with email ${req.body.email} is not found.`);
  } else {
    const token: string = await generateAccessToken(
      userFind.id,
      req.body.email,
      "5m"
    );

    const link = `http://${process.env.DB_HOST}:${process.env.SERVER_PORT}/reset-password/${userFind.id}/${token}`;
    console.log(link);
    res.send("Link has been send to your email.");
  }
};*/

//export const resetPassword = async (req: Request, res: Response) => {};
