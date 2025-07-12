import { TableExtended } from "@/app/lib/utils-client";
import { createContext, SetStateAction } from "react";

interface TableContextType {
    table: TableExtended;
    panelUpdate: () => void;
    setConflicts: React.Dispatch<SetStateAction<Array<string | undefined> | undefined>> | undefined;
}
export const TableContext = createContext<TableContextType>({
    table: new TableExtended(""),
    panelUpdate: () => {},
    setConflicts: undefined,
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