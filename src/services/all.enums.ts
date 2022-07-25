export const enum HashRound {
  OneRound = 1,
  FiveRound = 5,
  EightRound = 8,
}

export enum UserRole {
  Admin = "Admin",
  Manager = "Manager",
  Player = "Player",
}

export const enum UserStatus {
  Active = "Active",
  Blocked = "Blocked",
}

export enum RequestType {
  BecomeManager = "Change role to Manager",
  JoinToTeam = "Add to the team",
  ExitFromTeam = "Exit from team",
  ChangeTeam = "Change team",
  UnbanProfile = "Unban profile",
}

export const enum RequestStatus {
  Approved = "Approved",
  Declined = "Declined",
  Pending = "Pending",
}
