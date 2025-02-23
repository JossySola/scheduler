"use client"
import { useEffect, useState } from "react";
import XForm from "../molecules/mol-XForm";
import XList from "../molecules/mol-XList";
import { SessionProvider } from "next-auth/react";
import { getTableAction } from "@/app/[lang]/table/actions";
import { Timestamp } from "../atoms/atom-timestamp";
import { useParams } from "next/navigation";
import { Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Link, useDisclosure } from "@heroui/react";
import { SecondaryButton } from "../atoms/atom-button";
import { ArrowCircleLeft, SettingsGear } from "geist-icons";
import { useRouter } from "next/navigation";

export default function XPanel ({ id }:{ id?: string }) {
    const router = useRouter()
    const params = useParams();
    const { lang } = params;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [ colHeaders, setColHeaders ] = useState<Array<string>>([]);
    const [ rowHeaders, setRowHeaders ] = useState<Array<string>>([]);
    const [ rows, setRows ] = useState<Array<Array<string>>>([]);
    const [ cols, setCols ] = useState<Array<number>>([]);
    const [ values, setValues ] = useState<Array<string>>([]);
    const [ preferences, setPreferences ] = useState<Array<Array<string>>>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>(lang === "es" ? "Sin título" : "Untitled table");
    const [ timestamps, setTimestamps ] = useState<{ "created_at": number, "updated_at": number }>();
    
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
        <section className="w-full flex flex-col justify-center p-8">
            <SessionProvider>
                <header className="flex flex-row gap-2">
                    <Button 
                    isIconOnly 
                    aria-label="Go back" 
                    variant="light" 
                    size="lg"
                    onPress={() => router.back()}>
                        <ArrowCircleLeft />
                    </Button>
                    <div>
                    {
                        timestamps ? <p>{ lang === "es" ? "Creado en " : "Created on " }{ formatter.format(new Date(timestamps.created_at)) }</p> : null
                    }
                    {
                        timestamps ? <Timestamp updated_at={timestamps.updated_at.toString()} /> : null
                    }
                    </div>
                </header>
                
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
                        <SecondaryButton onPress={onOpen} endContent={<SettingsGear width="16px" />}>{ lang === "es" ? "Ajustes" : "Settings"}</SecondaryButton>
                        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
                            <DrawerContent>
                                {onClose => (
                                    <>
                                    <DrawerHeader className="flex flex-col justify-center items-center gap-1">{ lang === "es" ? "Ajustes de tabla" : "Schedule Settings"}</DrawerHeader>
                                    <DrawerBody>
                                    <XList 
                                    name={ lang === "es" ? "Valores" : "Values" }
                                    items={values}
                                    setItems={setValues} />
                                    <Divider />
                                    <XList 
                                    name={ lang === "es" ? "Ajustes de Filas" : "Rows Settings" }
                                    preferences={preferences}
                                    items={rowHeaders}
                                    setItems={setRowHeaders}
                                    criteria={colHeaders} 
                                    values={values}
                                    enableInput={false} 
                                    enableRemoval={false} />
                                    </DrawerBody>
                                    <DrawerFooter>
                                        <SecondaryButton onPress={onClose}>{ lang === "es" ? "Cerrar" : "Close" }</SecondaryButton>
                                    </DrawerFooter>
                                    </>
                                )}
                            </DrawerContent>
                        </Drawer>
                    </>
                </XForm>
            </SessionProvider>
        </section>
        
    )
}