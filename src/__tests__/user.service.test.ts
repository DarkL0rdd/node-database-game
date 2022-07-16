import { sequelize } from "../sequelize";
import {
  blockUserById,
  createUser,
  getInfoAllUsersByRole,
  getInfoOneUserByRoleAndId,
  getInfoUserProfile,
  unblockUserById,
} from "../services/user.service";

/*describe("Function createUser:", () => {
  test("Should create new user in db.", async () => {
    const firstName = "NewFirstName";
    const role_id = 3;
    const secondName = "NewSecondName";
    const email = "newemail@gmail.com";
    const password = "newpassworD123@";
    const status = "Active";
    const newUser = await createUser(firstName, secondName, email, password);
    expect(newUser).toMatchObject({
      first_name: firstName,
      role_id: role_id,
      second_name: secondName,
      email: email,
      password: newUser.password,
      status: status,
    });
  });
});*/

describe("Function getInfoUserProfile:", () => {
  test("Should find user in db and show his info.", async () => {
    const userEmail = "test6@gmail.com";
    const userInfo = await getInfoUserProfile(userEmail);
    const objUser = {
      first_name: userInfo.first_name,
      role: { role_name: userInfo.role.role_name },
      second_name: userInfo.second_name,
      email: userInfo.email,
    };
    expect(objUser).toEqual({
      first_name: "test6",
      second_name: "test6",
      email: "test6@gmail.com",
      role: { role_name: "Player" },
    });
  });

  test("Should throw error if user email is not found in db.", async () => {
    const userEmail = "test255@gmail.com";
    let errObj = undefined;
    try {
      const userInfo = await getInfoUserProfile(userEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "User not found." });
  });
});

describe("Function changeInfoUserProfile:", () => {});

describe("Function getInfoAllUsersByRole:", () => {
  test("Should find all users in db and show his info.", async () => {
    const roleName = "Player";
    const usersInfo = await getInfoAllUsersByRole(roleName);
    expect(usersInfo.length).toBeGreaterThan(0);
    const userProperty = [
      "id",
      "role_id",
      "team_id",
      "first_name",
      "second_name",
      "email",
      "status",
      "reason",
      "createdAt",
      "updatedAt",
      "role",
    ];
    const roleProperty = ["id", "role_name", "createdAt", "updatedAt"];
    for (let i = 0; i < usersInfo.length; i++) {
      for (let j = 0; j < userProperty.length; j++) {
        expect(usersInfo[i]).toHaveProperty(userProperty[j]);
        for (let k = 0; k < roleProperty.length; k++) {
          expect(usersInfo[i].role).toHaveProperty(roleProperty[k]);
        }
      }
    }
  });

  test("Should throw error if users are not found in db.", async () => {
    const wrongRoleName = "NOT_Player";
    let errObj = undefined;
    try {
      const usersInfo = await getInfoAllUsersByRole(wrongRoleName);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Users not found." });
  });
});

describe("Function getInfoOneUserByRoleAndId:", () => {
  test("Should find user in db.", async () => {
    const roleName = "Player";
    const userId = "3";
    const userInfo = await getInfoOneUserByRoleAndId(roleName, userId);
    expect(userInfo).toBeDefined();

    const objUser = JSON.parse(JSON.stringify(userInfo));
    const userProperty = [
      "id",
      "role_id",
      "team_id",
      "first_name",
      "second_name",
      "email",
      "status",
      "reason",
      "createdAt",
      "updatedAt",
      "role",
    ];
    const roleProperty = ["id", "role_name", "createdAt", "updatedAt"];
    for (let i = 0; i < userProperty.length; i++) {
      expect(objUser).toHaveProperty(userProperty[i]);
      for (let j = 0; j < roleProperty.length; j++) {
        expect(objUser.role).toHaveProperty(roleProperty[j]);
      }
    }
  });

  test("Should throw error if user is not found in db.", async () => {
    const roleName = "Player";
    const userId = "255";
    let errObj = undefined;
    try {
      const userInfo = await getInfoOneUserByRoleAndId(roleName, userId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "User not found." });
  });
});

describe("Function blockUserById:", () => {
  test("Should block user in db.", async () => {
    const role = "Player";
    const userId = "3";
    const affectedRow = await blockUserById(userId);
    expect(affectedRow[0]).toBeGreaterThan(0);
  });

  test("Should throw error if user is not found in db.", async () => {
    const role = "Player";
    const userId = "255";
    let errObj = undefined;
    try {
      const affectedRow = await blockUserById(userId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Error block user." });
  });
});

describe("Function unblockUserById:", () => {
  test("Should block user in db.", async () => {
    const role = "Player";
    const userId = "3";
    const affectedRow = await unblockUserById(userId);
    expect(affectedRow[0]).toBeGreaterThan(0);
  });

  test("Should throw error if user is not found in db.", async () => {
    const role = "Player";
    const userId = "255";
    let errObj = undefined;
    try {
      const affectedRow = await unblockUserById(userId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Error unblock user." });
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
