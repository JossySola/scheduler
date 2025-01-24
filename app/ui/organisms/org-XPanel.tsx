"use client"
import { useEffect, useState } from "react";
import XForm from "../molecules/mol-XForm";
import XList from "../molecules/mol-XList";
import { SessionProvider } from "next-auth/react";
import { getTableAction } from "@/app/(routes)/table/actions";

export default function XPanel ({ id }:{ id?: string }) {
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ preferences, setPreferences ] = useState<Array<Array<string>>>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>("Untitled table");
    const [ timestamps, setTimestamps ] = useState<{ "created_at": number, "updated_at": number }>()
    
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
                timestamps ? <p>Created at { formatter.format(new Date(timestamps.created_at)) }</p> : null
            }
            {
                timestamps ? <p>{ formatTimeAgo(timestamps.updated_at.toString()) }</p> : null
            }
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

function formatTimeAgo (date: string) {
    const now = new Date();
    const updated = new Date(date);

    if (isNaN(updated.getTime())) {
        throw new Error("Invalid date passed");
    }
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMs / 7);
    const diffMonths = Math.floor(diffMs / 30);

    if (diffMinutes < 1) return "Updated just now";
    if (diffMinutes < 60) return `Updated ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `Updated ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `Updated ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 4) return `Updated ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    return `Updated ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}