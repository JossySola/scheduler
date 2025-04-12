import TableButtonAi from "../atoms/atom-table-button-ai";
import ColumnSettings from "./mol-column-settings";
import RowSettings from "./mol-row-settings";

export default function AISection () {
    return (
        <fieldset className="w-full flex flex-col justify-center items-center md:justify-start md:w-5xl">
            <div className="w-full w-max-5xl flex flex-wrap flex-col justify-center items-center sm:items-start sm:flex-row md:w-5xl gap-5">
                <RowSettings />
                <ColumnSettings />
            </div>
            <TableButtonAi />
        </fieldset>
    )
}