"use client"
import { TableHandlersContext, TableHandlersType } from "@/app/[lang]/table/context";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function RowTabCard ({ rowIndex, name }: {
    rowIndex: number,
    name: string,
}) {
    const params = useParams();
    const lang = params.lang;
    const { columnHeaders, values, rowSpecs, setRowSpecs }: TableHandlersType = useContext(TableHandlersContext);
    const [ disable, setDisable ] = useState<boolean>((rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].disable) ?? false);
    const [ enabledColumns, setEnabledColumns ] = useState<Array<string>>((rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].enabledColumns) ?? []);
    const [ count, setCount ] = useState<number>((rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].count) ?? 0);
    const [ enabledValues, setEnabledValues ] = useState<Array<string>>((rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].enabledValues) ?? []);
    const update = () => {
        setRowSpecs && setRowSpecs(prev => {
            const updated = [...prev];
            if (updated[rowIndex]) {
                updated[rowIndex] = {
                    ...updated[rowIndex],
                    disable,
                    count,
                    enabledValues,
                    enabledColumns,
                }
            }
            return updated;
        })
    }
    const debouncedUpdate = useDebouncedCallback(update, 500);
    useEffect(() => {
        debouncedUpdate();
    }, [disable, enabledColumns, count, enabledValues]);
    
    return (
        <Card className="p-3">
            <CardBody key={ rowIndex } className="flex flex-col gap-5">
                <Switch
                className="mb-5" 
                color="danger" 
                key={`row-${rowIndex}-disable-${disable}` }
                isSelected={ disable }
                onValueChange={ setDisable } 
                name={`Specification: Row ${rowIndex} named <'${name}'>, disable on the entire table`}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup
                className="mb-5"
                key={`row-${rowIndex}-enabledColumns-${enabledColumns[rowIndex]}` }
                isDisabled={ disable }
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
                value={ enabledColumns }
                onValueChange={ setEnabledColumns }>
                    {
                        columnHeaders && columnHeaders.map((variable, index) => {
                            if (index !== 0) {
                                return <Checkbox
                                key={`cols-${variable}-${index}`} 
                                name={`Specification: Row ${index} named <'${name}'>, should be used on this column specifically:`}
                                value={variable}>
                                    { variable ? variable : lang === "es" ? <i>Sin nombre</i> : <i>No name yet</i> }
                                </Checkbox>
                            }
                        })
                    }
                </CheckboxGroup>

                <NumberInput
                key={ `row-${rowIndex}-count-${count}` }
                name={`Specification: Row ${rowIndex} named <'${name}'>, this is in how many columns the row should be filled in:`}
                label={ lang === "es" ? "¿En cuántas columnas debería de aparecer?" : "In how many columns should it appear?" }
                labelPlacement="inside"
                className="mb-5"
                minValue={ 0 }
                isDisabled={ disable }
                value={ count }
                onValueChange={ setCount }/>

                <CheckboxGroup
                className="mb-5"
                key={`row-${rowIndex}-enabledValues-${enabledValues[rowIndex]}` }
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
                isDisabled={ disable }
                value={ enabledValues }
                onValueChange={ setEnabledValues }>
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