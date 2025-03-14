"use client"
import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Timestamp } from "../atoms/atom-timestamp";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/react";
import { PlusCircle } from "geist-icons";
import DeleteTableModal from "./mol-delete-table-modal";

export default function DashboardTable ({ rows, lang }: {
    rows: Array<{ table_id: string, table_name: string, updated_at: string, created_at: string }>,
    lang: "en" | "es",
}) {
    const months = lang === "es" ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] : 
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octubre", "November", "December"];
    return (
        <section className="p-8">
            <Button as={HeroLink} href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/new`} color="success" className="text-white mt-3 mb-3" endContent={<PlusCircle />} disabled={ rows && rows.length === 3 }>{ lang === "es" ? "Crear nuevo" : "Create new"}</Button>
            {
                rows && rows.length === 0 || rows.length === 1 && <Chip className="m-3" variant="dot" color="success">{ lang === "es" ? `Tabla ${rows.length} de 3` : `Schedule ${rows.length} out of 3` }</Chip>
            }
            {
                rows && rows.length === 2 && <Chip className="m-3" variant="dot" color="warning">{ lang === "es" ? `Tabla ${rows.length} de 3` : `Schedule ${rows.length} out of 3` }</Chip>
            }
            {
                rows && rows.length === 3 && <Chip className="m-3" variant="dot" color="danger">{ lang === "es" ? `Tabla ${rows.length} de 3` : `Schedule ${rows.length} out of 3` }</Chip>
            }
            <Table aria-label="Dashboard table" className="shadow-lg">
                <TableHeader>
                    <TableColumn>{ lang === "es" ? "Nombre" : "Name" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Fecha de creación" : "Created on" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Última modificación" : "Last Update" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Acción" : "Action" }</TableColumn>
                </TableHeader>
                <TableBody emptyContent={ lang === "es" ? "No hay nada por mostrar" : "No tables to display" }>
                {
                    rows && rows.map((row, index) => { 
                        const created = new Date(row.created_at);
                        const createdDate = `${months[created.getMonth()]} ${created.getDate()}, ${created.getFullYear()}`
                        return (
                        <TableRow key={`${row.table_name}${index}`}>
                            <TableCell><Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/${row.table_id}`}>{row.table_name}</Link></TableCell>
                            <TableCell>{createdDate}</TableCell>
                            <TableCell><Timestamp updated_at={row.updated_at}/></TableCell>
                            <TableCell>
                                <DeleteTableModal table_id={row.table_id} table_name={row.table_name} />
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