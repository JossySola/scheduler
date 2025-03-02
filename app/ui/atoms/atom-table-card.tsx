"use client"
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { Specs } from "../molecules/mol-YTable-tabs";
import { SetStateAction } from "react";

export default function TableTabCard ({ columns, values, tab, lang, specs, setSpecs, index }: {
    columns: string[],
    values: string[],
    tab: string,
    lang: "en" | "es",
    specs: Specs,
    setSpecs: React.Dispatch<SetStateAction<Specs>>,
    index: number,
}) {
    return (
        <Card>
            <CardBody>
                <Switch 
                className="m-4" 
                color="danger" 
                isSelected={specs.disable[index]} 
                onValueChange={() => {
                    let newValue = specs.disable;
                    newValue[index] = !newValue[index];
                    setSpecs(prev => ({
                        ...prev,
                        disable: newValue
                    }))
                }} 
                name={`Specification:disable-Row-${tab}-on-table`}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup
                className="m-4"
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
                value={specs.enabledColumns[index]}
                isDisabled={specs.disable[index]}
                onValueChange={e => {
                    let newValue = specs.enabledColumns;
                    newValue[index] = e;
                    setSpecs(prev => ({
                        ...prev,
                        enabledColumns: newValue
                    }))
                }}>
                    {
                        columns && columns.map((variable, index) => {
                            if (index !== 0) {
                                return <Checkbox key={`${variable}${index}`} name={`Specification:Row-${tab}-should-be-used-on`} value={variable}>{ variable ? variable : lang === "es" ? <i>Sin valor</i> : <i>No value</i> }</Checkbox>
                            }
                            return null
                        })
                    }
                </CheckboxGroup>

                <NumberInput 
                label={ lang === "es" ? "¿Cuántas veces debería aparecer en la tabla?" : "How many times should it appear on the schedule?" }
                labelPlacement="outside-left"
                value={specs.count[index]}
                minValue={0}
                maxValue={columns.length}
                isDisabled={specs.disable[index]}
                onValueChange={e => {
                    let newValue = specs.count;
                    newValue[index] = e;
                    setSpecs(prev => ({
                        ...prev,
                        count: newValue
                    }))
                }}/>

                <CheckboxGroup
                className="m-4"
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
                value={specs.enabledValues[index]}
                isDisabled={specs.disable[index]}
                onValueChange={e => {
                    let newValue = specs.enabledValues;
                    newValue[index] = e;
                    setSpecs(prev => ({
                        ...prev,
                        enabledValues: newValue
                    }))
                }}>
                    {
                        values && values.map((variable, index) => {
                            return <Checkbox 
                            key={`${variable}${index}`} 
                            name={`Specification:Row-${tab}-use-this-value-specifically`} value={ variable }>{ variable }</Checkbox>
                        })
                    }
                </CheckboxGroup>
            </CardBody>
        </Card>
    )
}