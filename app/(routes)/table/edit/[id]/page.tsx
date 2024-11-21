'use client'
import { useTableById } from "@/app/hooks/custom";
import TablePanel from "@/app/ui/molecules/mol-table-panel";

export default function Page ({ params }: {
    params: Promise<{ id: string }>
}) {
    const { data, error, isLoading } = useTableById({ params });
    // http://localhost:3000/table/edit/_8eea43e99cbd4fafb6ca50bc098f48f0_untitled_1731303485221
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;
    
    return (
        <form>
            <input name="table-name" id="table-name" type="text" defaultValue="Untitled" placeholder="Untitled" />
            <TablePanel rowsProp={data} />
        </form>
    )
}