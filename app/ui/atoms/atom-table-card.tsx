"use client"
import { Specs } from "@/app/hooks/custom";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { SetStateAction } from "react";
import { LocalSpecs } from "../molecules/mol-YTable-tabs";

export default function TableTabCard ({ columns, values, tab, lang, specs, localSpecs, setLocalSpecs, index }: {
    columns: string[],
    values: string[],
    tab: string,
    lang: "en" | "es",
    localSpecs: LocalSpecs,
    setLocalSpecs: React.Dispatch<SetStateAction<LocalSpecs>>,
    specs: Specs,
    index: number,
}) {
    return (
        <Card>
            <CardBody key={index}>
                <Switch 
                className="m-4" 
                color="danger" 
                isSelected={ localSpecs.disable[index] }
                defaultChecked={ specs && specs.disable ? specs.disable : false } 
                onValueChange={ () => {
                    let newValue = localSpecs.disable;
                    newValue[index] = !newValue[index];
                    setLocalSpecs(prev => ({
                        ...prev,
                        disable: newValue,
                    }))
                } } 
                name={`Specification:disable-Row-${tab}-on-table`}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup
                className="m-4"
                isDisabled={ localSpecs.disable[index] }
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
                defaultValue={ specs && specs.enabledColumns ? specs.enabledColumns : [""] }
                value={ localSpecs.enabledColumns[index] }
                onValueChange={e => {
                    let newValue = localSpecs.enabledColumns;
                    newValue[index] = e;
                    setLocalSpecs(prev => ({
                        ...prev,
                        enabledColumns: newValue,
                    }))
                }}>
                    {
                        columns && columns.map((variable, index) => {
                            if (index !== 0) {
                                return <Checkbox 
                                key={`cols-${variable}-${index}`} 
                                name={`Specification:Row-${tab}-should-be-used-on`} 
                                value={variable}>
                                    { variable ? variable : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                                </Checkbox>
                            }
                        })
                    }
                </CheckboxGroup>

                <NumberInput 
                label={ lang === "es" ? "¿Cuántas veces debería aparecer en la tabla?" : "How many times should it appear on the schedule?" }
                labelPlacement="outside-left"
                minValue={ 0 }
                maxValue={ columns && columns.length ? columns.length - 1 : 0 }
                isDisabled={ localSpecs.disable[index] }
                value={ localSpecs.count[index] }
                onValueChange={e => {
                    let newValue = localSpecs.count;
                    newValue[index] = e;
                    setLocalSpecs(prev => ({
                        ...prev,
                        count: newValue,
                    }))
                }}/>

                <CheckboxGroup
                className="m-4"
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
                isDisabled={ localSpecs.disable[index] }
                defaultValue={ specs && specs.enabledValues ? specs.enabledValues : [""] }
                value={ localSpecs.enabledValues[index] }
                onValueChange={e => {
                    let newValue = localSpecs.enabledValues;
                    newValue[index] = e;
                    setLocalSpecs(prev => ({
                        ...prev,
                        enabledValues: newValue,
                    }))
                }}>
                    {
                        values && values.map((variable, index) => {
                            return <Checkbox 
                            key={`value-${variable}-${index}`} 
                            name={`Specification:Row-${tab}-use-this-value-specifically`} value={ variable }>{ variable }</Checkbox>
                        })
                    }
                </CheckboxGroup>
            </CardBody>
        </Card>
    )
}