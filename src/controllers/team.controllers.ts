import { NextFunction, Request, Response } from "express";
import { deletePlayerFromTeamById, getInfoAllTeams, getInfoTeamById } from "../services/team.service";

export const showInfoAllTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await getInfoAllTeams();
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

export const showInfoTeamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await getInfoTeamById(req.params.id);
    res.json(team);
  } catch (err) {
    next(err);
  }
};

export const deletePlayerFromTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePlayerFromTeamById(req.body.player_id);
    res.status(200).json({ Message: `Player removed from team.` });
  } catch (err) {
    next(err);
  }
};
