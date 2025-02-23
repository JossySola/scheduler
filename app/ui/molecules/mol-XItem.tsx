"use client"
import { Checkbox, CheckboxGroup, Divider, NumberInput, Switch } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function XItem ({ name, preferences, criteria = [], values = []} : {
    name: string,
    criteria: Array<string>,
    preferences?: Array<Array<string>>,
    values?: Array<string>,
}) {
    const params = useParams();
    const { lang } = params;
    const [ count, setCount ] = useState<number>(() => {
        if (preferences) {
            const [ num ] = preferences.map(subArray => {
                if (subArray[0].trim() === `Specification:Row-${name}-should-appear-only-this-amount-of-times`) {
                    if (!subArray[1]) {
                        return 0;
                    }
                    return parseInt(subArray[1]);
                }
            }).filter(value => value !== undefined);
            return num;
        }
        if (criteria && criteria.length) criteria.length;
        return 0;
    });
    const [ disable, setDisable ] = useState<boolean>(() => {
        if (preferences) {
            const result = preferences.find(subArray => subArray[0].trim() === `Specification:disable-Row-${name}-on-table`);
            if (result) {
                return true;
            }
        }
        return false;
    });
    const [ enabledColumns, setEnabledColumns ] = useState<Array<string>>([]);
    const [ enabledValues, setEnabledValues ] = useState<Array<string>>([]);
    /*const [ enabledColumns, setEnabledColumns ] = useState<Array<boolean>>(criteria.map(value => {
        if (preferences) {
            const result = preferences.find(subArray => {
                return (subArray[0].trim() === `Specification:Row-${name}-should-be-used-on` && subArray[1].trim() === value.trim())
            });
            if (result) {
                return true;
            }
        }
        return false;
    }));*/
    /*const [ enabledValues, setEnabledValues ] = useState<Array<boolean>>(values.map(value => {
        if (preferences) {
            const result = preferences.find(subArray => {
                return (subArray[0].trim() === `Specification:Row-${name}-use-this-value-specifically` && subArray[1].trim() === value.trim())
            });
            if (result) {
                return true;
            }
        }
        return false;
    }));*/
    
    useEffect(() => {
        setCount(prevCount => (prevCount === criteria.length ? criteria.length : prevCount));
    }, [criteria]);
    
    return (
        <section>
            <h3 className="text-center">{ lang === "es" ? `Especificaciones de la fila "${name}"` : `"${name}" row criteria` }</h3>
            <Switch className="m-4" color="danger" isSelected={disable} onValueChange={setDisable} name={`Specification:disable-Row-${name}-on-table`}>
                { lang === "es" ? "Deshabilitar en todas las columnas" : "Disable on all columns" }
            </Switch>

            <CheckboxGroup
            className="m-4"
            label={ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable on certain columns:" }
            value={enabledColumns}
            onValueChange={setEnabledColumns}>
                {
                    criteria && criteria.map((variable, index) => {
                        return <Checkbox key={`${variable}${index}`} name={`Specification:Row-${name}-should-be-used-on`} value={variable}>{ variable }</Checkbox>
                    })
                }
            </CheckboxGroup>

            <NumberInput 
            label={ lang === "es" ? "¿Cuántas veces debería ser en la tabla?" : "How many times it should appear on the schedule?" }
            labelPlacement="outside-left"
            value={count}
            minValue={0}
            maxValue={criteria.length}
            onValueChange={setCount}/>
            
            <CheckboxGroup
            className="m-4"
            label={ lang === "es" ? "Preferir usar estos valores en la fila:" : "Prefer the following values to use in this row:"}
            value={enabledValues}
            onValueChange={setEnabledValues}>
                {
                    values && values.map((variable, index) => {
                        return <Checkbox 
                        key={`${variable}${index}`} 
                        name={`Specification:Row-${name}-use-this-value-specifically`} value={ variable }>{ variable }</Checkbox>
                    })
                }
            </CheckboxGroup>
            <Divider />
        </section>
    )
}