'use client'
import { TableState } from "@/lib/definitions";
import { Button, Content, Dialog, DialogTrigger, Heading } from "@react-spectrum/s2/Dialog";
import { ListView, ListViewItem, type Selection } from "@react-spectrum/s2/ListView";
import { useMemo, useState } from "react";

export default function HardConstraintsModal({ rows, replaceRowsList, replaceColsList }: {
    rows: TableState,
    replaceRowsList: (selection: Set<string>) => void,
    replaceColsList: (selection: Set<string>) => void,
}) {
    // States to manage selections
    const [rowsSelected, setRowsSelected] = useState<Selection>(new Set());
    const [colsSelected, setColsSelected] = useState<Selection>(new Set());

    // Memoized calculations of the rows and columns headers from the 'rows' prop
    const rowHeaders = useMemo(() => rows 
    ? rows.map(row => row[0])
    : [], [rows]);
    const colHeaders = useMemo(() => rows && rows[0]
    ? rows[0].map(col => col)
    : [] , [rows]);

    // Handlers to update local and parent states
    const handleRowsSelection = (keys: Selection) => {
        if (keys === 'all') {
            setRowsSelected(keys);
            replaceRowsList(new Set(rowHeaders));
        }
        setRowsSelected(keys);
        replaceRowsList(keys as Set<string>);
    }
    const handleColumnsSelection = (keys: Selection) => {
        if (keys === 'all') {
            setColsSelected(keys);
            replaceColsList(new Set(colHeaders));
        }
        setColsSelected(keys);
        replaceColsList(keys as Set<string>);
    }
    return (
        <DialogTrigger>
            <Button variant="primary">Hard Constraints</Button>
            <Dialog isDismissible={true} isKeyboardDismissDisabled={true}>
                {
                    () => (
                        <>
                            <Heading slot="title">Hard Constraints</Heading>
                            <Content>
                                <h4>Disable Rows:</h4>
                                <ListView 
                                aria-label="Rows list to disable" 
                                selectionMode="multiple" 
                                selectedKeys={rowsSelected} 
                                onSelectionChange={handleRowsSelection}>
                                    {
                                        rowHeaders 
                                        ? rowHeaders.map((row, index) => index !== 0 && (
                                            <ListViewItem id={`${index}.${row}`} key={`${index}.${row}`}>
                                                { row ?? "Untitled" }
                                            </ListViewItem>
                                        ))
                                        : null
                                    }
                                </ListView>
                                
                                <h4>Disable Columns:</h4>
                                <ListView 
                                aria-label="Columns list to disable" 
                                selectionMode="multiple" 
                                selectedKeys={colsSelected} 
                                onSelectionChange={handleColumnsSelection}>
                                    {
                                        colHeaders 
                                        ? colHeaders.map((col, index) => index !== 0 && (
                                            <ListViewItem id={`${index}.${col}`} key={`${index}.${col}`}>
                                                { col ?? "Untitled" }
                                            </ListViewItem>
                                        ))
                                        : null
                                    }
                                </ListView>
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}