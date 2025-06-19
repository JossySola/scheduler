import {
  KmsKeyringBrowser,
  KMS,
  getClient,
  buildClient,
  CommitmentPolicy,
} from "@aws-crypto/client-browser";

export async function encryptKMS (data: string) {
    const generatorKeyId = process.env.AWS_KMS_GENERATOR_KEY;
    const keyIds = [`${process.env.AWS_KMS_ARN}`];
    const accessKeyId = process.env.AWS_KMS_KEY;
    const secretAccessKey = process.env.AWS_KMS_SECRET;
    if (!accessKeyId || !secretAccessKey || !process.env.AWS_KMS_ARN || !data || !generatorKeyId) return null;
    try {
        const { encrypt } = buildClient(
        CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
        );
        const clientProvider = getClient(KMS, {
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
        });
        const keyring = new KmsKeyringBrowser({ clientProvider, generatorKeyId, keyIds });
        const context = {
        stage: 'development',
        purpose: 'strategic schedule maker',
        origin: 'us-east-1',
        }
        const encoder = new TextEncoder();
        const plainText = encoder.encode(data);
        const { result } = await encrypt(keyring, plainText, { encryptionContext: context });
        return result;
    } catch (e) {
        return null;
    }
}
export async function decryptKMS (data: Uint8Array) {
    const generatorKeyId = process.env.AWS_KMS_GENERATOR_KEY;
    const keyIds = [`${process.env.AWS_KMS_ARN}`];
    const accessKeyId = process.env.AWS_KMS_KEY;
    const secretAccessKey = process.env.AWS_KMS_SECRET;
    if (!accessKeyId || !secretAccessKey || !process.env.AWS_KMS_ARN || !data || !generatorKeyId) return null;
    try {
        const { decrypt } = buildClient(
        CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
        )
        const clientProvider = getClient(KMS, {
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
        });
        const keyring = new KmsKeyringBrowser({
        clientProvider,
        generatorKeyId,
        keyIds,
        });
        const context = {
        stage: 'development',
        purpose: 'strategic schedule maker',
        origin: 'us-east-1',
        }
        const { plaintext, messageHeader } = await decrypt(keyring, data);
        const { encryptionContext } = messageHeader;
        Object.entries(context).forEach(([key, value]) => {
        if (encryptionContext[key] !== value)
            throw new Error('Encryption Context does not match expected values');
        })
        return plaintext;
    } catch (e) {
        return null;
    }
}
export function getDeviceInfo() {
    if (typeof window === 'undefined') return null; // SSR guard
  
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelDepth: window.screen.pixelDepth,
      deviceMemory: (navigator as any).deviceMemory || 'Unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
    };
}

export type RowType = {
    colIndex: number,
    rowIndex: number,
    value: string,
    specs?: {
        disabled?: boolean,
        disabledCols?: Array<string>,
        rowTimes?: number,
        preferValues?: Array<string>,
        colTimes?: number,
        valueTimes?: Array<number>,
    },
};
export class Table {
    #rows: Array<Map<string, RowType>> = [];
    constructor(storedRows?: Array<Map<string, RowType>>) {
        this.#rows = storedRows ?? [];
    }
    // Statics
    static indexToLabel (index: number): string {
        let label = '';
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }
    // Setters & Getters
    get size (): number {
        return this.#rows.length;
    }
    get rows (): Array<Map<string, RowType>> {
        return this.#rows;
    }
    set rows (newRows: Array<Map<string, RowType>>) {
        this.#rows = newRows;
    }
    // Methods
    insertColumn (): void {
        if (this.size === 0) {
            const newMap = new Map();
            newMap.set(`A0`, {
                colIndex: 0,
                rowIndex: 0,
                value: "",
                specs: {
                    disabled: false,
                    disabledCols: [],
                    rowTimes: 0,
                    preferValues: [],
                    colTimes: 0,
                    valueTimes: [],
                },
            })
            this.#rows.push(newMap);
            return;
        }
        this.#rows.forEach((row: Map<string, RowType>, rowIndex: number) => {
            const label = `${Table.indexToLabel(row.size)}${rowIndex}`;
            row.set(label, {
                colIndex: row.size,
                rowIndex,
                value: "",
                specs: {
                    disabled: false,
                    disabledCols: [],
                    rowTimes: 0,
                    preferValues: [],
                    colTimes: 0,
                    valueTimes: [],
                },
            })
        })
    }
    insertRow () {
        if (this.size === 0) {
            const newMap = new Map();
            newMap.set("A0", {
                colIndex: 0,
                rowIndex: 0,
                value: "",
                specs: {
                    disabled: false,
                    disabledCols: [],
                    rowTimes: 0,
                    preferValues: [],
                    colTimes: 0,
                    valueTimes: [],
                },
            })
            this.#rows.push(newMap);
            return;
        }
        const newMap = new Map();
        const newRow = Array.from(this.size > 0 ? this.#rows[0].keys() : []);
        newRow.forEach((_: string, index: number) => newMap.set(
            `${Table.indexToLabel(index)}${this.size}`, {
            colIndex: index,
            rowIndex: this.size,
            value: "",
            specs: {
                disabled: false,
                disabledCols: [],
                rowTimes: 0,
                preferValues: [],
                colTimes: 0,
                valueTimes: [],
            },
        }))
        this.#rows.push(newMap);
    }
    deleteColumn () {
        if (this.size === 0) return;
        if (this.#rows[0].size === 1) {
            this.#rows = [];
            return;
        };
        const label = Table.indexToLabel(this.#rows[0].size-1);
        this.#rows.forEach(row => row.delete(`${label}${this.size-1}`));
    }
    deleteRow () {
        if (this.size === 0) return;
        this.#rows.pop();
    }
    edit (colIndex: number, rowIndex: number, value: string): boolean {
        const letter = Table.indexToLabel(colIndex);
        const label = `${letter}${rowIndex}`;
        if (!this.#rows[rowIndex]) return false;
        const cellExists: boolean = this.#rows[rowIndex].has(label);
        if (!cellExists) return false;
        if (rowIndex === 0 || colIndex === 0) {
            const columnIsDuplicate = Array.from(this.#rows[0].values()).some(v => String(v.value).toLowerCase() === String(value).toLowerCase());
            if (columnIsDuplicate === true) return false;
            const rowIsDuplicate = this.#rows.some(v => v.get(label)?.value.toLowerCase() === value.toLowerCase());
            if (rowIsDuplicate === true) return false;
        }
        const obj = this.#rows[rowIndex].get(label);
        if (obj !== undefined) {
            obj.value = value;
        }
        return true;
    }
}
export class TableExtended extends Table {
    #values: Set<string> = new Set();

    constructor(storedRows?: Array<Map<string, RowType>>, storedValues?: Set<string>) {
        super(storedRows);
        this.#values = storedValues ?? new Set();
    }
    set values(newValues: Set<string>) {
        this.#values = newValues;
    }
    get values() {
        return this.#values;
    }
}

/*
export class Table {
    #rows: Array<Map<any, any>>;
    #title: string;
    #monthsES: Array<string> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    #monthsEN: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    #daysES: Array<string> = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    #daysEN: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    constructor(title?: string, stored_rows?: Array<Map<any, any>>) {
        if (stored_rows && stored_rows.length > 0) {
            const keys = Array.from(stored_rows[0].keys());
            const allMatch = stored_rows.every(row =>
                JSON.stringify(Array.from(row.keys())) === JSON.stringify(keys)
            );
            if (!allMatch) throw new Error("Inconsistent column labels.");
        }
        this.#rows = stored_rows ?? [];
        this.#title = title ?? "";
        this.#monthsES = this.#monthsES;
        this.#monthsEN = this.#monthsEN;
        this.#daysES = this.#daysES;
        this.#daysEN = this.#daysEN;
    }
    // Statics
    static indexToLabel (index: number): string {
        let label = '';
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }
    // Setters & Getters
    get rows (): Array<Map<any, any>> {
        return this.#rows;
    }
    set rows (newRows: Array<Map<any, any>>) {
        this.#rows = newRows;
    }
    get title (): string {
        return this.#title;
    }
    set title (value: string) {
        this.#title = value;
    }
    get size (): number {
        return this.#rows.length > 0 ? this.#rows[0].size : 0;
    }
    get months_en (): Array<string> {
        return this.#monthsEN;
    }
    get months_es (): Array<string> {
        return this.#monthsES;
    }
    get days_en (): Array<string> {
        return this.#daysEN;
    }
    get days_es (): Array<string> {
        return this.#daysES;
    }
    // Methods
    addColumn (): void {
        const label = Table.indexToLabel(
            this.#rows.length > 0 ? this.#rows[0].size : 0
        );
        if (this.#rows.length === 0) {
            const map = new Map();
            map.set(label, "");
            this.#rows.push(map);
            return;
        }
        this.#rows.forEach(row => row.set(label, ""));
    }
    addRow (): void {
        const newRow = new Map();
        if (this.#rows.length === 0) {
            newRow.set("A", "");
            this.#rows.push(newRow);
            return;
        }
        const columnLabels = Array.from(this.#rows.length > 0 ? this.#rows[0].keys() : []);
        columnLabels.forEach(label => newRow.set(label, ""));
        this.#rows.push(newRow);
    }
    removeColumn (index: number): void {
        if (this.#rows.length === 0) return;
        if (this.#rows.length > 0 && this.#rows[0].size === 1) {
            this.#rows = [];
            return;
        }
        const label = Table.indexToLabel(index);
        this.#rows.length && this.#rows.forEach(row => row.delete(label));
    }
    removeRow (): void {
        this.#rows.pop();
    }
    modifyCell (columnIndex: number, rowIndex: number, value: string): boolean {
        const label = Table.indexToLabel(columnIndex);
        if (!this.#rows[rowIndex]) return false;
        const cellExists: string | undefined = this.#rows[rowIndex].get(label);
        if (cellExists === undefined) return false;
        if (rowIndex === 0) {
            const columnIsDuplicate = Array.from(this.#rows[0].values()).some(v => String(v).toLowerCase() === String(value).toLowerCase());
            if (columnIsDuplicate === true) return false;
        } else if (columnIndex === 0) {
            const rowIsDuplicate = this.#rows.filter(rowMap => {
                const header = rowMap.get("A").toLowerCase();
                if (header === value.toLowerCase()) {
                    return rowMap;
                }
            })
            if (rowIsDuplicate.length > 0) return false;
        }
        this.#rows[rowIndex].set(label, value);
        return true;
    }
}
type RowTabType = {
    "name": string,
    "disabled": boolean,
    "disabledCols": Array<string>,
    "rowTimes": number,
    "preferValues": Array<string>,
}
type ColTabType = {
    "name": string,
    "colTimes": number,
    "valueTimes": Array<number>,
}
export class DynamicTable extends Table {
    #values: Array<string>;
    #row_specs: Array<Map<any, any>>;
    #col_specs: Array<Map<any, any>>;

    constructor(title?: string, stored_rows?: Array<Map<any, any>>, stored_values?: Array<string>, stored_row_specs?: Array<Map<any, any>>, stored_col_specs?: Array<Map<any, any>>) {
        super(title, stored_rows);
        this.#values = stored_values ?? [];
        this.#row_specs = stored_row_specs ?? [];
        this.#col_specs = stored_col_specs ?? [];
    }
    // Setters & Getters
    set values (newValues: Array<string>) {
        if (Array.isArray(newValues)) {
            this.#values = newValues;
        }
    }
    get values (): Array<string> {
        return this.#values;
    }
    get row_specs (): Array<Map<any, any>> {
        return this.#row_specs;
    }
    get col_specs (): Array<Map<any, any>> {
        return this.#col_specs;
    }
    // Methods
    createRowTab (name: string): void {
        const newRowTab = new Map();
        newRowTab.set("name", name);
        newRowTab.set("disabled", false);
        newRowTab.set("disabledCols", []);
        newRowTab.set("rowTimes", this.rows.length > 0 ? this.rows[0].size : 0);
        newRowTab.set("preferValues", []);
        this.#row_specs.push(newRowTab);
    }
    updateRowTab ( 
        index: number,
        key: "name" | "disabled" | "disableCols" | "rowTimes" | "preferedValues", 
        value: string | boolean | Array<string> | number,
    ): void {
        if (this.#row_specs && this.#row_specs[index]) {
            this.#row_specs[index].set(key, value);
        }
    }
    createColTab (name: string): void {
        const newColTab = new Map();
        newColTab.set("name", name);
        newColTab.set("colTimes", this.rows.length ?? 0);
        newColTab.set("valueTimes", []);
        this.#col_specs.push(newColTab);
    }
    updateColTab (
        index: number,
        key: "name" | "colTimes" | "valueTimes",
        value: string | number | Array<number>,
    ): void {
        if (this.#col_specs && this.#col_specs[index]) {
            this.#col_specs[index].set(key, value);
        }
    }
    deleteRowTab (): void {
        if (this.#row_specs.length === 1) {
            this.#row_specs = [];
            this.#col_specs = [];
            return;
        }
        this.#row_specs.pop();
    }
    deleteColTab (): void {
        if (this.#col_specs.length === 0) {
            this.#row_specs = [];
            return;
        }
        this.#col_specs.pop();
    }
}
*/