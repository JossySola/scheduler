'use client'

export default function NewDynamicTable(): React.JSX.Element {

    return (
        <>
            <form>
                <input type="text" name="name" id="name" placeholder="Untitled table" defaultValue="Untitled table"/>
                <table>
                </table>
            </form>
        </>
    )
}

