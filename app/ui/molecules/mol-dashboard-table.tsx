"use client"
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Timestamp } from "../atoms/atom-timestamp";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/react";
import { PlusCircle } from "geist-icons";
import DeleteTableModal from "./mol-delete-table-modal";

export default function DashboardTable ({ rows, lang }: {
    rows: Array<{ table_id: string, table_name: string, updated_at: string}>,
    lang: "en" | "es",
}) {
    return (
        <section className="p-8">
            <Button as={HeroLink} href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/new`} color="success" className="text-white mt-3 mb-3" endContent={<PlusCircle />}>{ lang === "es" ? "Crear nuevo" : "Create new"}</Button>
            <Table aria-label="Dashboard table">
                <TableHeader>
                    <TableColumn>{ lang === "es" ? "Nombre" : "Name" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Última modificación" : "Last Update" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Acción" : "Action" }</TableColumn>
                </TableHeader>
                <TableBody emptyContent={ lang === "es" ? "No hay nada por mostrar" : "No tables to display" }>
                {
                    rows && rows.map((row, index) => { 
                        return (
                        <TableRow key={`${row.table_name}${index}`}>
                            <TableCell><Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/${row.table_id}`}>{row.table_name}</Link></TableCell>
                            <TableCell><Timestamp updated_at={row.updated_at}/></TableCell>
                            <TableCell>
                                <DeleteTableModal table_id={row.table_id} />
                            </TableCell>
                        </TableRow>
                        )
                    })
                }
                </TableBody>
            </Table>
        </section>
    )
}