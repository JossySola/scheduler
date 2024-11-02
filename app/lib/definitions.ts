export type Result_FormDataToQuery = {
    id: string,
    name: string,
    columns: string,
    rows: Array<string>
}
export type TableFormData = {
    [index: string]: string,
    'table-name': string,
}