"use client"
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { useParams } from "next/navigation"
import { useState } from "react";

export default function RowSpecs ({ tab }: {
    tab: Map<any, any>, 
}) {
    const { lang } = useParams<{ lang: "en" | "es" }>();
    const [toggle, setToggle] = useState<boolean>(tab.get("disabled"));
    const [disableCols, setDisableCols] = useState<Array<string>>(tab.get("disableCols"));
    const [number, setNumber] = useState<number>(tab.get("rowTimes"));
    const [preferValues, setPreferValues] = useState<Array<string>>(tab.get("preferValues"));
    console.log(tab.get('disableCols'))
    return (
        <Card>
            <CardBody className="flex flex-col gap-5 p-5">
                <Switch 
                color="danger" 
                isSelected={toggle}
                onValueChange={value => {
                    tab.set("disabled", value);
                    setToggle(value);
                }}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup 
                isDisabled={tab.get("disabled")} 
                value={disableCols}
                onValueChange={value => {
                    tab.set("disableCols", value);
                    setDisableCols(value);
                }}
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }>
                    {
                        tab.get("disableCols") && tab.get("disableCols").map((col: string, colIndex: number) => {
                            return <Checkbox key={colIndex} value={col} onValueChange={value => tab.set("disableCols", value)}>
                                { col ? col : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                            </Checkbox>
                        })
                    }
                </CheckboxGroup>

                <NumberInput 
                label={ lang === "es" ? "¿En cuántas columnas debería de aparecer?" : "In how many columns should it appear?" }
                aria-label={ lang === "es" ? "Cantidad de columnas" : "Columns' amount" }
                labelPlacement="inside"
                isDisabled={tab.get("disabled")}
                value={number}
                onValueChange={value => { 
                    tab.set("rowTimes", value);
                    setNumber(value);
                }} />

                <CheckboxGroup
                isDisabled={tab.get("disabled")}
                value={preferValues}
                onValueChange={value => {
                    tab.set("preferValues", value);
                    setPreferValues(value);
                }}
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}>
                    {
                        tab.get("preferValues") && tab.get("preferValues").map((val: string, valIndex: number) => {
                            return <Checkbox key={valIndex} value={val} onValueChange={value => tab.set("preferValues", value)}>
                                { val ? val : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                            </Checkbox>
                        })
                    }
                </CheckboxGroup>
            </CardBody>
        </Card>
    )
}