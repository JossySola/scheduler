"use server"
export async function SaveTableAction (state: { message: string }, formData: FormData) {
    console.log("[SaveTableAction] Starting...")
    console.log("[SaveTableAction] Received:", formData)
    console.log("[SaveTableAction] Unpacking...")
    const content = UNPACK(formData);
    console.log("[SaveTableAction] Content:", content)
    console.log("[SaveTableAction] Sorting...")
    const sort = SORT(content);
    console.log("[SaveTableAction] Sort:", sort)
    console.log("[SaveTableAction] Fetching /api/table/save...")
    const saving = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/table/save`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: formData.get("table_title"),
            rows: sort
        })
    })
    console.log("[SaveTableAction] Fetch result:", saving)
    return {
        message: ""
    }
}
const UNPACK = (formData: FormData) => {
    let pack = [];
    for (const pair of formData.entries()) {
        if (pair[0].startsWith("$")) {
            break;
        }
        pack.push(pair)
    }
    return pack;
}
const SORT = (pack: Array<[string, FormDataEntryValue]>) => {
    let numRows = 0;
    let newArray = [];

    // Get how many columns are
    pack.forEach(([key, value]) => {
        if (key.match(/[A-Z][0-9]/)) {
            const index = parseInt(key[1]) + 1;
            if (index > numRows) {
                numRows = index;
            }
        }
    })
    // Add empty array representing rows
    for (let count = 0; count < numRows; count ++) {
        newArray.push([])
    }
    // Pushes elements based on their name index, e.g.: A1 to index 1
    pack.forEach(([key, value]) => {
        if (key.match(/[A-Z][0-9]/)) {
            const index = parseInt(key[1]);
            newArray[index].push(value);
        }
    })
    return newArray;
}