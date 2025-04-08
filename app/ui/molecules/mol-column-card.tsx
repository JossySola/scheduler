"use client"
import { TableHandlersContext, TableHandlersType, TableSpecsContext, TableSpecsType } from "@/app/[lang]/table/context";
import { Card, CardBody, NumberInput, Select, SelectItem } from "@heroui/react";
import { useParams } from "next/navigation";
import { useContext } from "react";

export default function ColumnTabCard ({ columnIndex, name }: {
    columnIndex: number,
    name: string,
}) {
    const params = useParams();
    const lang = params.lang;
    const { values, colSpecs, setColSpecs }: TableSpecsType = useContext(TableSpecsContext);
    const { rowHeaders }: TableHandlersType = useContext(TableHandlersContext);
    const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    return (
        <Card className="p-5">
            <CardBody key={ columnIndex } className="flex flex-col gap-5">
                <NumberInput 
                name={ `Specification: Column ${columnLetters[columnIndex]} named <'${ name }'>, must have this fixed amount of rows filled in:` }
                variant="bordered"
                radius="full"
                size="md"
                className="mb-5"
                value={ colSpecs && colSpecs[columnIndex] && colSpecs[columnIndex].numberOfRows }
                onValueChange={ n => {
                    if (setColSpecs) {
                        return setColSpecs(prev => {
                            const newSpecs = [...prev];
                            if (newSpecs[columnIndex]) {
                                newSpecs[columnIndex].numberOfRows = n;
                            }
                            return newSpecs;
                        })
                    }
                }}
                minValue={ 0 }
                maxValue={ rowHeaders && rowHeaders.length ? rowHeaders.length - 1 : 0 }
                label={ lang === "es" ? "Número de filas a llenar en esta columna" : "Amount of rows to fill in this column" }
                labelPlacement="outside" />
                
                {
                    values && rowHeaders && values.map((value, index) => {
                        return <Select 
                            className="mb-5"
                            name={ `Specification: Column ${columnLetters[columnIndex]} named <'${ name }'>, use the value: "${value}" in this column this amount of times:` }
                            label={ lang === "es" ? `Usar el valor "${value}" esta cantidad de veces: `: `Use the value "${value}" this amount of times:`} 
                            labelPlacement="outside"
                            selectedKeys={ colSpecs && colSpecs[columnIndex] && colSpecs[columnIndex].amountOfValues }
                            onSelectionChange={ s => {
                                if (setColSpecs) {
                                    return setColSpecs(prev => {
                                        const newSpecs = [...prev];
                                        newSpecs[columnIndex] = {
                                            ...newSpecs[columnIndex],
                                            amountOfValues: [String(s)],
                                        }
                                        return newSpecs;
                                    })
                                }
                            }}
                            key={ index }>
                            {
                                rowHeaders.map((_, index) => {
                                    if (index === 0) {
                                        return <SelectItem key="any">{ lang === "es" ? "Cualquiera" : "Any" }</SelectItem>
                                    }
                                    return <SelectItem key={ index }>{ index }</SelectItem>
                                })
                            }
                        </Select>
                    })
                }
            </CardBody>
        </Card>
    )
}