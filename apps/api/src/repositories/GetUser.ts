import { prisma, type User } from "@template-web-app/db";

type TGetUserByIdWhere = {
  id: string;
  username?: never;
  email?: never;
};

type TGetUserByUsernameWhere = {
  id?: never;
  username: string;
  email?: never;
};

type TGetUserByEmailWhere = {
  id?: never;
  username?: never;
  email: string;
};

type TGetUserWhere = TGetUserByIdWhere | TGetUserByUsernameWhere | TGetUserByEmailWhere;

const GetUserRepositorie = async (where: TGetUserWhere): Promise<User | null> =>
  prisma.user.findUnique({
    where,
  });

export {
  GetUserRepositorie,
  type TGetUserByEmailWhere,
  type TGetUserByIdWhere,
  type TGetUserByUsernameWhere,
  type TGetUserWhere,
};
