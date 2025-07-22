import bcryptjs from "bcryptjs";
import envVars from "../configs/env";

const hashPassword = async (password: string) => {
  const hashedPassword = await bcryptjs.hash(
    password as string,
    parseInt(envVars.SALT as string)
  );

  return hashedPassword;
};

export default hashPassword;
