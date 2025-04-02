"use client"
import { TableHandlersContext, TableHandlersType, TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function TableTabCard ({ rowIndex, name }: {
    rowIndex: number,
    name: string,
}) {
    const { columnHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const { values, specs, setSpecs }: TableSpecsType = useContext(TableSpecsContext);
    const [ max, setMax ] = useState<number>(() => columnHeaders && columnHeaders.length > 0 ? columnHeaders.length - 1 : 0);
    const params = useParams();
    const lang = params.lang;
    
    useEffect(() => setMax(() => columnHeaders && columnHeaders.length > 0 ? columnHeaders.length - 1 : 0), [columnHeaders])
    
    return (
        <Card className="p-3">
            <CardBody key={ rowIndex }>
                <Switch
                className="m-4" 
                color="danger" 
                isSelected={ specs && specs[rowIndex] && specs[rowIndex].disable }
                onValueChange={ e => setSpecs && setSpecs(prev => {
                    const duplicate = [...prev];
                    if (duplicate[rowIndex]) duplicate[rowIndex].disable = e;
                    return [...duplicate];
                }) } 
                name={`Specification: Row ${rowIndex} named <'${name}'>, disable on the entire table`}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup
                className="m-4"
                isDisabled={ specs && specs[rowIndex] && specs[rowIndex].disable }
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
                value={ specs && specs[rowIndex] && specs[rowIndex].enabledColumns }
                onValueChange={ e => setSpecs && setSpecs(prev => {
                    const duplicate = [...prev];
                    if (duplicate[rowIndex]) duplicate[rowIndex].enabledColumns = e;
                    return [...duplicate];
                }) }>
                    {
                        columnHeaders && columnHeaders.map((variable, index) => {
                            if (index !== 0) {
                                return <Checkbox
                                key={`cols-${variable}-${index}`} 
                                name={`Specification: Row ${index} named <'${name}'>, is meant to be used on this column:`} 
                                value={variable}>
                                    { variable ? variable : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                                </Checkbox>
                            }
                        })
                    }
                </CheckboxGroup>

                <NumberInput
                name={`Specification: Row ${rowIndex} named <'${name}'>, should be used this fixed amount of times:`}
                label={ lang === "es" ? "¿Cuántas veces debería aparecer en la tabla?" : "How many times should it appear on the schedule?" }
                labelPlacement="outside"
                minValue={ 0 }
                maxValue={ max }
                isDisabled={ specs && specs[rowIndex] && specs[rowIndex].disable }
                value={ specs && specs[rowIndex] ? specs[rowIndex].count : 0 }
                onValueChange={ n => {
                    if (setSpecs) {
                        return setSpecs(prev => {
                            [...prev][rowIndex].count = n;
                            return [...prev];
                        })
                    }
                } }/>

                <CheckboxGroup
                className="m-4"
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
                isDisabled={ specs && specs[rowIndex] && specs[rowIndex].disable }
                value={ specs && specs[rowIndex] && specs[rowIndex].enabledValues }
                onValueChange={ e => setSpecs && setSpecs(prev => {
                    const duplicate = [...prev];
                    if (duplicate[rowIndex]) duplicate[rowIndex].enabledValues = e;
                    return [...duplicate];
                }) }>
                    {
                        values && values.map((variable, index) => {
                            return <Checkbox
                            key={`value-${variable}-${index}`} 
                            name={`Specification: Row ${index} named <'${name}'>, has this value assigned:`} value={ variable }>{ variable }</Checkbox>
                        })
                    }
                </CheckboxGroup>
            </CardBody>
        </Card>
    )
}