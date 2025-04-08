import TableButtonAi from "../atoms/atom-table-button-ai";
import ColumnSettings from "./mol-column-settings";
import RowSettings from "./mol-row-settings";

export default function AISection () {
    return (
        <fieldset className="w-fit flex flex-col justify-center items-center">
            <div className="flex flex-col sm:flex-row gap-5">
                <RowSettings />
                <ColumnSettings />
            </div>
            <TableButtonAi />
        </fieldset>
    )
}