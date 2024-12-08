'use client'
import { useTableById } from "@/app/hooks/custom";
import TablePanel from "@/app/ui/molecules/mol-table-panel";

export default function Page ({ params }: {
    params: Promise<{ id: string }>
}) {
    const { data, error, isLoading } = useTableById({ params });
    // http://localhost:3000/table/edit/_d981e3d3f7bb4325a5bfec35d72e4fc0_name_1733274076000
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;
    
    return (
        <>
            <input name="table-name" id="table-name" type="text" defaultValue="Untitled" placeholder="Untitled" />
            <TablePanel rowsProp={data} />
        </>
    )
}