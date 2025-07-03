"use client"
import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Timestamp } from "../atoms/atom-timestamp";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/react";
import DeleteTableModal from "./mol-delete-table-modal";
import { PlusCircle } from "../icons";
import { useParams } from "next/navigation";

export default function DashboardTable ({ metadata }: {
    metadata: Array<{ table_id: string, table_name: string, updated_at: string, created_at: string }>,
}) {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const months = lang === "es" ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] : 
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octubre", "November", "December"];
    return (
        <section className="h-screen w-full p-5 pt-0 sm:p-10 sm:pt-0">
            <section className="flex items-center justify-center flex-row sm:justify-start">
                <Button as={HeroLink} href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/new`} color="success" style={{ textDecoration: "none" }} className="text-white text-md mt-3 mb-3" endContent={<PlusCircle />} disabled={ metadata && metadata.length === 3 }>{ lang === "es" ? "Crear nuevo" : "Create new"}</Button>
                {
                    metadata && metadata.length === 0 || metadata.length === 1 && <Chip className="m-3" variant="dot" color="success">{ lang === "es" ? `Tabla ${metadata.length} de 3` : `Schedule ${metadata.length} out of 3` }</Chip>
                }
                {
                    metadata && metadata.length === 2 && <Chip className="m-3" variant="dot" color="warning">{ lang === "es" ? `Tabla ${metadata.length} de 3` : `Schedule ${metadata.length} out of 3` }</Chip>
                }
                {
                    metadata && metadata.length === 3 && <Chip className="m-3" variant="dot" color="danger">{ lang === "es" ? `Tabla ${metadata.length} de 3` : `Schedule ${metadata.length} out of 3` }</Chip>
                }
            </section>
            
            <Table aria-label="Dashboard table" className="w-full shadow-lg">
                <TableHeader>
                    <TableColumn>{ lang === "es" ? "Nombre" : "Name" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Fecha de creación" : "Created on" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Última modificación" : "Last Update" }</TableColumn>
                    <TableColumn>{ lang === "es" ? "Acción" : "Action" }</TableColumn>
                </TableHeader>
                <TableBody emptyContent={ lang === "es" ? "No hay nada por mostrar" : "No tables to display" }>
                {
                    metadata && metadata.map((row, index) => { 
                        const created = new Date(row.created_at);
                        const createdDate = `${months[created.getMonth()]} ${created.getDate()}, ${created.getFullYear()}`
                        return (
                        <TableRow key={`${row.table_name}${index}`}>
                            <TableCell><Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/table/${row.table_id}`}>{row.table_name}</Link></TableCell>
                            <TableCell>{createdDate}</TableCell>
                            <TableCell><Timestamp updated_at={row.updated_at}/></TableCell>
                            <TableCell>
                                <DeleteTableModal table_id={row.table_id} table_name={row.table_name.toString()} />
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