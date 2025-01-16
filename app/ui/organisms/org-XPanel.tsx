"use client"
import { useEffect, useState } from "react";
import XForm from "../molecules/mol-XForm";
import XList from "../molecules/mol-XList";
import { SessionProvider } from "next-auth/react";

export default function XPanel ({ id }:{ id?: string }) {
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);

    // Update colHeaders and rowHeaders based on rows modifications
    useEffect(() => {
        let update: Array<string> = [];
        rows.forEach((row, index) => {
            if (index === 0) {
                return false;
            }
            update.push(row[0]);
        })
        setRowHeaders(update);
    }, [rows]);

    useEffect(() => {
        if (rows && rows[0]) {
            setColHeaders(() => {
                return rows[0].toSpliced(0,1);
            })
        }
    }, [rows]);

    return (
        <SessionProvider>
            <XForm id={id} rows={rows} setRows={setRows} values={values}>
                <>
                    <XList 
                    name="Rows" 
                    items={rowHeaders}
                    setItems={setRowHeaders}
                    criteria={colHeaders} 
                    values={values}
                    enableInput={false} 
                    enableRemoval={false} />
                    
                    <XList 
                    name="Values"
                    items={values}
                    setItems={setValues} />
                </>
            </XForm>
        </SessionProvider>
        
    )
}