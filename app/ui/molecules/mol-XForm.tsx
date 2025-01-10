import XTable from "./mol-XTable";

export default async function XForm ({ id }: { id: string }) {
    // save table
    return (
        <form>
            <XTable id={id} />
        </form>
    )
}