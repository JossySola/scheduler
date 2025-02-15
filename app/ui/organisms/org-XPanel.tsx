"use client"
import { useEffect, useState } from "react";
import XForm from "../molecules/mol-XForm";
import XList from "../molecules/mol-XList";
import { SessionProvider } from "next-auth/react";
import { getTableAction } from "@/app/[lang]/table/actions";
import { Timestamp } from "../atoms/atom-timestamp";
import { useParams } from "next/navigation";

export default function XPanel ({ id }:{ id?: string }) {
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);
    const [ cols, setCols ] = useState<Array<number>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ preferences, setPreferences ] = useState<Array<Array<string>>>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>("Untitled table");
    const [ timestamps, setTimestamps ] = useState<{ "created_at": number, "updated_at": number }>();
    const params = useParams();
    const { lang } = params;
    
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
                if (res) {
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
                    if (res.timestamps) {
                        setTimestamps(res.timestamps);
                    }
                    if (res.cols) {
                        setCols(res.cols);
                    }
                }
                setLoading(false);
            })
        }
    }, [id]);

    const formatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC"
    });

    if (loading) {
        return <p>Loading...</p>
    }
    return (
        <SessionProvider>
            {
                timestamps ? <p>{ lang === "es" ? "Creado en " : "Created on " }{ formatter.format(new Date(timestamps.created_at)) }</p> : null
            }
            {
                timestamps ? <Timestamp updated_at={timestamps.updated_at.toString()} /> : null
            }
            <XForm 
            id={id} 
            rows={rows} 
            setRows={setRows} 
            values={values} 
            setValues={setValues}
            title={title}
            setTitle={setTitle}
            cols={cols}>
                <>
                    <XList 
                    name={ lang === "es" ? "Ajustes de Filas" : "Rows Settings" }
                    preferences={preferences}
                    items={rowHeaders}
                    setItems={setRowHeaders}
                    criteria={colHeaders} 
                    values={values}
                    enableInput={false} 
                    enableRemoval={false} />
                    
                    <XList 
                    name={ lang === "es" ? "Valores" : "Values" }
                    items={values}
                    setItems={setValues} />
                </>
            </XForm>
        </SessionProvider>
    )
}