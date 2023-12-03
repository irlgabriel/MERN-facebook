import jwt from "jsonwebtoken";

export default (user_id: string, next: (e: any) => void) => {
  jwt.sign(
    { user_id },
    process.env.JWT_SECRET as string,
    (err: any, token?: string) => {
      if (err) next(err);
      return token;
    }
  );
};
