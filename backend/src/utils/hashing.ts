export const bcryptHash = async (password: string) => await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 4,
});

export const bcryptVerify = async (password: string, hashedPassword: string) => await Bun.password.verify(password, hashedPassword, "bcrypt");