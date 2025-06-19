import { TableExtended } from "@/app/lib/utils-client";
import React, { createContext, SetStateAction } from "react";

interface TableContextType {
    table: TableExtended;
    setPanelRender: React.Dispatch<SetStateAction<number>> | null;
}
export const TableContext = createContext<TableContextType>({
    table: new TableExtended(),
    setPanelRender: null,
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