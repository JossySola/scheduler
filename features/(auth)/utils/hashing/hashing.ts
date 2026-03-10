import { hash, type Options, verify } from "@node-rs/argon2";

const opts: Options = {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
    outputLen: 32,
    algorithm: 2,
};
export async function hashPassword(password: string) {
    const result = await hash(password, opts);
    return result;
}
export async function verifyPassword(data: { password: string; hash: string }) {
    const { password, hash } = data;
    const result = await verify(hash, password, opts);
    return result;
}