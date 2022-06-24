export const enum HashRound {
  OneRound = 1,
  FiveRound = 5,
  EightRound = 8,
}

export const enum UserRole {
  Admin = "Admin",
  Manager = "Manager",
  Player = "Player",
}

export const enum UserStatus {
  Active = "Active",
  Blocked = "Blocked",
}

export enum PlayerRequest {
  BecomeManager = "Change role to Manager",
  AddToTeam = "Add to the team",
  ExitTeam = "Exit from team",
  ChangeTeam = "Change team",
  UnbanProfile = "Unban profile",
}

export const enum RequestStatus {
  Approved = "Approved",
  Declined = "Declined",
  Pending = "Pending",
}

export const enum Panel {
  AdminPanel = "admin-panel",
  ManagerPanel = "manager-panel",
  PlayerPanel = "player-panel",
}

export enum ParamsList {
  AdminList = "list-admins",
  ManagerList = "list-managers",
  PlayerList = "list-players",
  TeamList = "list-teams",
  MyList = "my-list-requests",
  AllList = "list-requests",
}
