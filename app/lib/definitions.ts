import { FieldDef } from "pg";

export interface UtilResponse {
    message: string,
    ok: boolean,
}
export interface UserResponse {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    role?: string;
    provider?: string;
}
export interface CAPTCHAResponse {
    success: boolean;
    score: number;
    action: string;
    challenge_ts: number;
    hostname: string;
    "error-codes": Array<"missing-input-secret" | "invalid-input-secret" | "missing-input-response" | "invalid-input-response" | "bad-request" | "timeout-or-duplicate">;
}
export interface PostgreSQLError {
    severity: "ERROR" | "FATAL" | "PANIC";
    sqlstate: number;
    message: string;
    detail?: string;
    hint?: string;
    position?: number;
    internal_position?: number;
    internal_query?: string;
    context?: string;
    schema_name?: string;
    table_name?: string;
    column_name?: string;
    data_type_name?: string;
    constraint_name?: string;
    file: string;
    line: number;
    routine: string;
}
export interface PostgreSQLResponse<T = any> {
    command: string;
    rowCount: number;
    oid: number | null;
    rows: T[];
    fields: FieldDef[];
}
export interface KMSDataKey {
    "CiphertextBlob": string,
    "KeyId": string,
    "KeyMaterialId": string,
    "KeyOrigin": "AWS_KMS",
    "Plaintext": string
}
export interface KMSDecryptedKey {
    "EncryptionAlgorithm": "SYMMETRIC_DEFAULT",
    "KeyId": string,
    "KeyMaterialId": string,
    "KeyOrigin": "AWS_KMS",
    "Plaintext": string
}

export type asyncActionStateResponse = [state: Awaited<{ message: string}>, dispatch: (payload: FormData) => void, isPending: boolean];

export function isPostgreSQLError(error: any): error is PostgreSQLError {
    return typeof error === "object" && error !== null && "severity" in error && "sqlstate" in error;
}