"use client"
import { Card, CardBody, Checkbox, CheckboxGroup, NumberInput, Switch, Tab, Tabs } from "@heroui/react"
import { useState } from "react"

export default function TableTabs ({ name, tabs, lang, values, criteria }: {
    name: string,
    tabs: Array<string>,
    lang: "en" | "es",
    values: Array<string>,
    criteria: Array<string>,
}) {
    const [ disable, setDisable ] = useState<boolean>(false);
    const [ count, setCount ] = useState<number>(0);
    const [ enabledValues, setEnabledValues ] = useState<Array<string>>([]);
    const [ enabledColumns, setEnabledColumns ] = useState<Array<string>>([]);
    return (
        <section className="flex flex-col items-center">
            <h3>{ name }</h3>
            {
                tabs && tabs.length ? <Tabs aria-label={ name }>
                {
                    tabs.map((tab, index) => {
                        if (index !== 0) {
                            return (
                            <Tab key={`${tab}-${index}`} title={tab ? tab : lang === "es" ? "Sin nombre" : "No name" }>
                                <Card>
                                    <CardBody>
                                        <Switch className="m-4" color="danger" isSelected={disable} onValueChange={setDisable} name={`Specification:disable-Row-${tab}-on-table`}>
                                            { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
                                        </Switch>
        
                                        <CheckboxGroup
                                        className="m-4"
                                        label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
                                        value={enabledColumns}
                                        isDisabled={disable}
                                        onValueChange={setEnabledColumns}>
                                            {
                                                criteria && criteria.map((variable, index) => {
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
                                        value={count}
                                        minValue={0}
                                        maxValue={criteria.length}
                                        isDisabled={disable}
                                        onValueChange={setCount}/>
        
                                        <CheckboxGroup
                                        className="m-4"
                                        label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
                                        value={enabledValues}
                                        isDisabled={disable}
                                        onValueChange={setEnabledValues}>
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
                            </Tab> )
                        }
                    })
                }
                </Tabs>
                 : lang === "es" ? <p>Aún no hay filas por mostrar</p> : <p>There are no rows yet</p>
            }
            
        </section>
    )
}