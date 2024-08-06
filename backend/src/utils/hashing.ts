import * as bcrypt from 'bcrypt';

export const bcryptHash = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const bcryptVerify = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};


// export const bcryptHash = async (password: string) => await bunHash.hash(password, {
//   algorithm: "bcrypt",
//   cost: 4,
// });

// export const bcryptVerify = async (password: string, hashedPassword: string) => await bunHash.verify(password, hashedPassword, "bcrypt");