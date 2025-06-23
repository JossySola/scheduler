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
    value: string,
    specs?: {
        disabled: boolean,
        disabledCols: Array<string>,
        rowTimes: number,
        preferValues: Array<string>,
        colTimes: number,
        valueTimes: Map<string, number>,
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
                value: "",
                specs: {
                    disabled: false,
                    disabledCols: [],
                    rowTimes: 0,
                    preferValues: [],
                    colTimes: 0,
                    valueTimes: new Map(),
                },
            })
            this.#rows.push(newMap);
            return;
        }
        this.#rows.forEach((row: Map<string, RowType>, rowIndex: number) => {
            const label = `${Table.indexToLabel(row.size)}${rowIndex}`;
            if (rowIndex === 0) {
                row.set(label, {
                    value: "",
                    specs: {
                        disabled: false,
                        disabledCols: [],
                        rowTimes: 0,
                        preferValues: [],
                        colTimes: 0,
                        valueTimes: new Map(),
                    },
                })
                return;
            }
            row.set(label, {
                value: "",
            })
        })
    }
    insertRow () {
        if (this.size === 0) {
            const newMap = new Map();
            newMap.set("A0", {
                value: "",
                specs: {
                    disabled: false,
                    disabledCols: [],
                    rowTimes: 0,
                    preferValues: [],
                    colTimes: 0,
                    valueTimes: new Map(),
                },
            })
            this.#rows.push(newMap);
            return;
        }
        const newMap = new Map();
        const newRow = Array.from(this.size > 0 ? this.#rows[0].keys() : []);
        newRow.forEach((_: string, index: number) => {
            if (index === 0) {
                newMap.set(
                `${Table.indexToLabel(index)}${this.size}`, {
                value: "",
                specs: {
                    disabled: false,
                    disabledCols: [],
                    rowTimes: 0,
                    preferValues: [],
                    colTimes: 0,
                    valueTimes: new Map(),
                }})
                return;
            }
            newMap.set(
            `${Table.indexToLabel(index)}${this.size}`, {
            value: ""})
        })
        this.#rows.push(newMap);
    }
    deleteColumn () {
        if (this.size === 0) return;
        if (this.#rows[0].size === 1) {
            this.#rows = [];
            return;
        };
        const label = Table.indexToLabel(this.#rows[0].size-1);
        this.#rows.forEach((row, rowIndex) => {
            row.delete(`${label}${rowIndex}`);
        });
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
    get values() {
        return this.#values;
    }
    addValue(value:string) {
        this.#values.add(value);
        if (this.rows.length) {
            this.rows[0].forEach(col => {
                if (col.specs) {
                    col.specs.valueTimes.set(value, this.size);
                }
            })
        }
    }
    deleteValue(value:string) {
        this.#values.delete(value);
        if (this.rows.length) {
            this.rows[0].forEach(col => {
                if (col.specs) {
                    col.specs.valueTimes.delete(value);
                }
            })
        }
    }
}