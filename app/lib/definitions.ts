export type Result_FormDataToQuery = {
    id: string;
    columns: string,
    columnsParams: string,
    rows: Array<Array<string | null>>
}
export type Action_State = {
    message?: string | null,
    errors?: {
        save?: string[],
    }
}

export interface Params {
    [index: string]: string;
}