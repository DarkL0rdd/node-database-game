import { Request, Response } from "express";
import { deletePlayerFromTeamById, getInfoAllTeams, getInfoTeamById } from "../services/team.service";

export const showInfoAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await getInfoAllTeams();
    res.json(teams);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};

export const showInfoTeamById = async (req: Request, res: Response) => {
  try {
    const team = await getInfoTeamById(req.params.id);
    return res.json(team);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ Message: err.message });
  }
};
