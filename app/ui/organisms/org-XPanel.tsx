"use client"
import { useState } from "react"
import XForm from "../molecules/mol-XForm"
import XList from "../molecules/mol-XList";

export default function XPanel ({ id }:{ id: string }) {
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);

    return (
        <>
        <XForm id={id}>
            <XList name="Rows" criteria={colHeaders} />
        </XForm>
        </>
    )
}