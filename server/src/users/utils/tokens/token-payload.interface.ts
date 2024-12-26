// export interface TokenPayload {
//   userId: string;
// }

export interface TokenPayload {
  userId: string;
  roles: string[];
  email: string;
}
