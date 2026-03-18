export type AuthRole = "ADMIN" | "USER";

export interface IAuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle: string;
  dailyCiroTarget: number;
  weeklyCiroTarget: number;
  monthlyCiroTarget: number;
  role: AuthRole;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthSessionUser extends IAuthUser {
  fullName: string;
  initials: string;
}
