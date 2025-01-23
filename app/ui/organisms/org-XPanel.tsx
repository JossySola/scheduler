"use client"
import { useEffect, useState } from "react";
import XForm from "../molecules/mol-XForm";
import XList from "../molecules/mol-XList";
import { SessionProvider } from "next-auth/react";
import { getTableAction } from "@/app/(routes)/dashboard/[id]/actions";

export default function XPanel ({ id }:{ id?: string }) {
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ preferences, setPreferences ] = useState<Array<Array<string>>>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>("Untitled table");
    
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

    useEffect(() => {
        if (id) {
            setLoading(true);
            getTableAction(id).then(res => {
                if (res && res.status === 200) {
                    setTitle(res.title);
                    if (res.table) {
                        setRows(res.table);
                    }
                    if (res.values) {
                        setValues(res.values);
                    }
                    if (res.specs) {
                        setPreferences(res.specs);
                    }
                }
                setLoading(false);
            })
        }
    }, [id]);

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <SessionProvider>
            <XForm 
            id={id} 
            rows={rows} 
            setRows={setRows} 
            values={values} 
            setValues={setValues}
            title={title}
            setTitle={setTitle}>
                <>
                    <XList 
                    name="Rows" 
                    preferences={preferences}
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