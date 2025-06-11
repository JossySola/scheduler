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
export class Table {
    #rows: Array<Map<any, any>> = [];
    #title: string = "";
    constructor(title?: string, stored_rows?: Array<Map<any, any>>) {
        if (stored_rows && stored_rows.length > 0) {
            const keys = Array.from(stored_rows[0].keys());
            const allMatch = stored_rows.every(row =>
                JSON.stringify(Array.from(row.keys())) === JSON.stringify(keys)
            );
            if (!allMatch) throw new Error("Inconsistent column labels.");
        }
        this.#rows = stored_rows ?? this.#rows;
        this.#title = title ?? this.#title;
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
    set reset (rows: Array<Map<any, any>>) {
        this.#rows = rows;
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