import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
}

export async function checkPasswordHash(
	password: string,
	hash: string
): Promise<boolean> {
	const passwordMatch = await bcrypt.compare(password, hash);
	return passwordMatch;
}
