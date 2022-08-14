import console from "console";
import { User } from "../models/user.model";
import { UserRequest } from "../models/userrequest.model";
import { sequelize } from "../sequelize";
import { RequestType } from "../services/all.enums";
import { CustomError } from "../services/error.service";
import {
  answerRequest,
  createUserRequest,
  getInfoAllRequests,
  getInfoOwnRequestById,
  getInfoOwnRequests,
  getInfoRequestById,
} from "../services/requests.service";
import { createUser } from "../services/user.service";

const userSequelize = sequelize.getRepository(User);
const requestSequelize = sequelize.getRepository(UserRequest);

describe("Function createUserRequest", () => {
  test("Should throw error if user not found in db.", async () => {
    const wrongUserEmail = "user_wrong_email@gmail.com";
    const requestType: RequestType = RequestType["UnbanProfile"];
    console.log(requestType);
    let errObj = undefined;
    try {
      const userInfo = await createUserRequest(wrongUserEmail, requestType);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "User not found." });
  });

  test("Should create user's request", async () => {
    const userObj = {
      first_name: "NewFirstName",
      role_id: 3,
      second_name: "NewSecondName",
      email: "new_email@gmail.com",
      password: "new_password",
      status: "Active",
    };
    const newUser = await createUser(userObj);

    const objRequestTypes: RequestType[] = Object.values(RequestType);
    for (let i = 0; i < objRequestTypes.length; i++) {
      let userRequest = await createUserRequest(newUser.email, objRequestTypes[i], "Test description", "Team 2");
      expect(userRequest).toBeDefined();
      expect(userRequest).toHaveProperty("id");
      expect(userRequest).toHaveProperty("user_id");
      expect(userRequest).toHaveProperty("request_type");
      expect(userRequest).toHaveProperty("team_id");
      expect(userRequest).toHaveProperty("description");
      expect(userRequest).toHaveProperty("status");
      expect(userRequest).toHaveProperty("createdAt");
      expect(userRequest).toHaveProperty("updatedAt");
    }

    requestSequelize.destroy({
      where: {
        user_id: newUser.id,
      },
    });

    userSequelize.destroy({
      where: {
        first_name: "NewFirstName",
        second_name: "NewSecondName",
        email: "new_email@gmail.com",
      },
    });
  });

  test("Should throw error if request type already exist", async () => {
    const userObj = {
      first_name: "NewFirstName",
      role_id: 3,
      second_name: "NewSecondName",
      email: "new_email@gmail.com",
      password: "new_password",
      status: "Active",
    };
    const newUser = await createUser(userObj);

    const objRequestTypes: RequestType[] = Object.values(RequestType);
    for (let i = 0; i < objRequestTypes.length; i++) {
      let userRequest = await createUserRequest(newUser.email, objRequestTypes[i], "Test description", "Team 2");
    }

    let errObj = undefined;
    try {
      for (let i = 0; i < objRequestTypes.length; i++) {
        let userRequest = await createUserRequest(newUser.email, objRequestTypes[i], "Test description", "Team 2");
      }
    } catch (err) {
      requestSequelize.destroy({
        where: {
          user_id: newUser.id,
        },
      });

      userSequelize.destroy({
        where: {
          first_name: "NewFirstName",
          second_name: "NewSecondName",
          email: "new_email@gmail.com",
        },
      });

      errObj = {
        status: err.status,
        message: err.message,
      };
      expect(errObj).toEqual({ status: 409, message: "This request type already exists." });
    }
  });
});

describe("Function getInfoAllRequests", () => {
  test("Should show all requests", async () => {
    const request = await getInfoAllRequests();
    expect(request.length).toBeGreaterThan(0);
  });

  test("Should throw error if requests not found", async () => {
    let errObj = undefined;
    try {
      const request = await getInfoAllRequests();
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "Requests not found." });
  });
});

describe("Function getInfoRequestById", () => {
  test("Should show request by id", async () => {
    const requestId = "16";
    const request = await getInfoRequestById(requestId);
    expect(request).toBeDefined();
    expect(request).toHaveProperty("id");
    expect(request).toHaveProperty("user_id");
    expect(request).toHaveProperty("request_type");
    expect(request).toHaveProperty("team_id");
    expect(request).toHaveProperty("description");
    expect(request).toHaveProperty("status");
    expect(request).toHaveProperty("createdAt");
    expect(request).toHaveProperty("updatedAt");
  });

  test("Should throw error if request not found", async () => {
    const wrongRequestId = "999";
    let errObj = undefined;
    try {
      const request = await getInfoRequestById(wrongRequestId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "Request not found." });
  });
});

describe("Function getInfoOwnRequests", () => {
  test("Should show own requests", async () => {
    const userEmail = "vadym@gmail.com";
    const request = await getInfoOwnRequests(userEmail);
    expect(request.length).toBeGreaterThan(0);
  });

  test("Should throw error if user email not found", async () => {
    const wrongUserEmail = "wrong_user_email";
    let errObj = undefined;
    try {
      const request = await getInfoOwnRequests(wrongUserEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "User not found." });
  });

  test("Should throw error if requests not found", async () => {
    const userEmail = "admin1@gmail.com";
    let errObj = undefined;
    try {
      const request = await getInfoOwnRequests(userEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "Requests not found." });
  });
});

describe("Function getInfoOwnRequestById", () => {
  test("Should show own request by id", async () => {
    const requestId = "16";
    const userEmail = "vadym@gmail.com";
    const request = await getInfoOwnRequestById(requestId, userEmail);
    expect(request).toBeDefined();
    expect(request).toBeDefined();
    expect(request).toHaveProperty("id");
    expect(request).toHaveProperty("user_id");
    expect(request).toHaveProperty("request_type");
    expect(request).toHaveProperty("team_id");
    expect(request).toHaveProperty("description");
    expect(request).toHaveProperty("status");
    expect(request).toHaveProperty("createdAt");
    expect(request).toHaveProperty("updatedAt");
  });

  test("Should throw error if user not found", async () => {
    const requestId = "3";
    const wrongUserEmail = "wrong_email@gmail.com";
    let errObj = undefined;
    try {
      const request = await getInfoOwnRequestById(requestId, wrongUserEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "User not found." });
  });

  test("Should throw error if request not found", async () => {
    const wrongRequestId = "30";
    const userEmail = "vadym@gmail.com";
    let errObj = undefined;
    try {
      const request = await getInfoOwnRequestById(wrongRequestId, userEmail);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "Request not found." });
  });
});

describe("Function answerRequest", () => {
  test("Should throw error if request not found", async () => {
    const wrongRequestId = "999";
    let errObj = undefined;
    try {
      const request = await answerRequest(wrongRequestId, "Declined");
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "Request not found." });
  });

  test("Should answer request", async () => {
    const userObj = {
      first_name: "NewFirstName",
      role_id: 3,
      second_name: "NewSecondName",
      email: "new_email@gmail.com",
      password: "new_password",
      status: "Active",
    };
    const newUser = await createUser(userObj);

    const objRequestTypes: RequestType[] = Object.values(RequestType);
    for (let i = 0; i < objRequestTypes.length; i++) {
      let userRequest = await createUserRequest(newUser.email, objRequestTypes[i], "Test description", "Team 2");
    }

    const requests = await requestSequelize.findAll({ where: { user_id: newUser.id } });
    for (let i = 0; i < requests.length; i++) {
      let request = await answerRequest(String(requests[i].id), "Declined", "Team 2", String(newUser.id));
    }

    const declinedRequest = await requestSequelize.findAll({ where: { user_id: newUser.id, status: "Declined" } });
    for (let i = 0; i < declinedRequest.length; i++) {
      expect(declinedRequest[i].status).toBe("Declined");
    }

    requestSequelize.destroy({
      where: {
        user_id: newUser.id,
      },
    });

    userSequelize.destroy({
      where: {
        first_name: "NewFirstName",
        second_name: "NewSecondName",
        email: "new_email@gmail.com",
      },
    });
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
