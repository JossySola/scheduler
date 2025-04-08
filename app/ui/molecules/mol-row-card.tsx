"use client"
import { TableHandlersContext, TableHandlersType, TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function RowTabCard ({ rowIndex, name }: {
    rowIndex: number,
    name: string,
}) {
    const { columnHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const { values, rowSpecs, setRowSpecs }: TableSpecsType = useContext(TableSpecsContext);
    const [ max, setMax ] = useState<number>(() => columnHeaders && columnHeaders.length > 0 ? columnHeaders.length - 1 : 0);
    const params = useParams();
    const lang = params.lang;
    
    useEffect(() => setMax(() => columnHeaders && columnHeaders.length > 0 ? columnHeaders.length - 1 : 0), [columnHeaders])
    
    return (
        <Card className="p-3">
            <CardBody key={ rowIndex } className="flex flex-col gap-5">
                <Switch
                className="mb-5" 
                color="danger" 
                isSelected={ rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].disable }
                onValueChange={ e => setRowSpecs && setRowSpecs(prev => {
                    const duplicate = [...prev];
                    if (duplicate[rowIndex]) duplicate[rowIndex].disable = e;
                    return [...duplicate];
                }) } 
                name={`Specification: Row ${rowIndex} named <'${name}'>, disable on the entire table`}>
                    { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                </Switch>

                <CheckboxGroup
                className="mb-5"
                isDisabled={ rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].disable }
                label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
                value={ rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].enabledColumns }
                onValueChange={ e => setRowSpecs && setRowSpecs(prev => {
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
                name={`Specification: Row ${rowIndex} named <'${name}'>, this is in how many columns the row should be filled in:`}
                label={ lang === "es" ? "¿En cuántas columnas debería de aparecer?" : "In how many columns should it appear?" }
                labelPlacement="inside"
                className="mb-5"
                minValue={ 0 }
                maxValue={ max }
                isDisabled={ rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].disable }
                value={ rowSpecs && rowSpecs[rowIndex] ? rowSpecs[rowIndex].count : 0 }
                onValueChange={ n => {
                    if (setRowSpecs) {
                        return setRowSpecs(prev => {
                            const duplicate = [...prev];
                            if (duplicate[rowIndex]) {
                                duplicate[rowIndex].count = n;
                            }
                            return duplicate;
                        })
                    }
                } }/>

                <CheckboxGroup
                className="mb-5"
                label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
                isDisabled={ rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].disable }
                value={ rowSpecs && rowSpecs[rowIndex] && rowSpecs[rowIndex].enabledValues }
                onValueChange={ e => setRowSpecs && setRowSpecs(prev => {
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