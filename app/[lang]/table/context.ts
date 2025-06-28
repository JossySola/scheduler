import { TableExtended } from "@/app/lib/utils-client";
import { createContext } from "react";

interface TableContextType {
    table: TableExtended;
    panelUpdate: () => void;
}
export const TableContext = createContext<TableContextType>({
    table: new TableExtended(),
    panelUpdate: () => {},
});
export const AnthropicGenerationContext = createContext({});
export interface AnthropicGenerationType {
    anthropicAction?: (payload: FormData) => void,
    anthropicPending?: boolean,
    anthropicState?: {
        rows: Array<Array<string>>,
        conflicts: Array<string>,
    }
}