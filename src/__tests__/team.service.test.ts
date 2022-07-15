import { sequelize } from "../sequelize";
import { deletePlayerFromTeamById, getInfoAllTeams, getInfoTeamById } from "../services/team.service";

describe("Function getInfoAllTeams:", () => {
  test("Should find teams in db.", async () => {
    const teams = await getInfoAllTeams();
    expect(teams.length).toBeGreaterThan(0);
    for (let i = 0; i < teams.length; i++) {
      expect(teams[i]).toHaveProperty("id");
      expect(teams[i]).toHaveProperty("team_name");
    }
  });
});

describe("Function getInfoTeamById:", () => {
  test("Should find team in db.", async () => {
    const teamId = "3";
    const team = await getInfoTeamById(teamId);
    expect(team).toBeDefined();
    expect(team).toHaveProperty("id"); //Number(id)
    expect(team).toHaveProperty("team_name"); //"Stun Seed"

    const jsonTeam = team.toJSON();
    expect(jsonTeam.users.length).toBeGreaterThan(0);

    const user = jsonTeam.users;
    for (let i = 0; i < user.length; i++) {
      expect(user[i]).toHaveProperty("id");
      expect(user[i]).toHaveProperty("first_name");
      expect(user[i]).toHaveProperty("second_name");
      expect(user[i]).toHaveProperty("email");
      expect(user[i]).toHaveProperty("team_id");
    }
  });

  test("Should throw error if team not found.", async () => {
    const wrongTeamId = "999";
    let errObj = undefined;
    try {
      const team = await getInfoTeamById(wrongTeamId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 404, message: "Team not found." });
  });
});

describe("Function deletePlayerFromTeamById:", () => {
  test("Should delete player from team.", async () => {
    const userId = "3";
    const returnValue = await deletePlayerFromTeamById(userId);
    expect(returnValue).toEqual([1]);
  });

  test("Should throw error if player not found.", async () => {
    const wrongUserId = "999";
    let errObj = undefined;
    try {
      const returnValue = await deletePlayerFromTeamById(wrongUserId);
    } catch (err) {
      errObj = {
        status: err.status,
        message: err.message,
      };
    }
    expect(errObj).toEqual({ status: 500, message: "Error delete player from team." });
  });
});

afterAll((done) => {
  sequelize.close();
  done();
});
