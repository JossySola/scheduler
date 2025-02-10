"use client"
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
                if (subArray[0].trim() === `Specification:Row-${name}-should-appear-this-amount-of-times`) {
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
    const [ enabledColumns, setEnabledColumns ] = useState<Array<boolean>>(criteria.map(value => {
        if (preferences) {
            const result = preferences.find(subArray => {
                return (subArray[0].trim() === `Specification:Row-${name}-should-be-used-on` && subArray[1].trim() === value.trim())
            });
            if (result) {
                return true;
            }
        }
        return false;
    }));
    const [ enabledValues, setEnabledValues ] = useState<Array<boolean>>(values.map(value => {
        if (preferences) {
            const result = preferences.find(subArray => {
                return (subArray[0].trim() === `Specification:use-${name}-as-value` && subArray[1].trim() === value.trim())
            });
            if (result) {
                return true;
            }
        }
        return false;
    }));
    
    useEffect(() => {
        setCount(prevCount => (prevCount === criteria.length ? criteria.length : prevCount));
    }, [criteria]);
    
    return (
        <details>
            <summary>{name}</summary>
            <label>
                { lang === "es" ? "Deshabilitar en todas las columnas:" : "Disable on all columns:" }
                <input 
                type="radio" 
                name={`Specification:disable-Row-${name}-on-table`} 
                value="Yes" 
                checked={disable} 
                onChange={() => setDisable(prev => !prev)}/>
            </label>

            <fieldset>
                <legend>{ lang === "es" ? "Habilitar solo en ciertas columnas:" : "Enable/disable in certain columns:" }</legend>
                {
                    criteria && criteria.map((variable, index) => {
                        return <label key={`${variable}-${index}`}>
                            <input 
                            type="checkbox" 
                            name={`Specification:Row-${name}-should-be-used-on`} 
                            value={variable} 
                            checked={!!enabledColumns[index]}
                            onChange={(() => {
                                setEnabledColumns(prev => 
                                    prev.map((col, colIndex) => colIndex === index ? !col : col )
                                )
                            })}/>
                            {variable}
                        </label>
                    })
                }
            </fieldset>

            <label>
                { lang === "es" ? "¿Cuántas veces debería ser rellenado?" : "How many times it should appear?" }
                <input 
                type="number" 
                name={`Specification:Row-${name}-should-appear-this-amount-of-times`} 
                min={0}
                max={criteria.length} 
                value={count} 
                onChange={e => {
                    setCount(parseInt(e.target.value, 10) || 0);
                }}/>
            </label>
            
            <fieldset>
                <legend>{ lang === "es" ? "Preferir estos valores:" : "Prefer the following values:"}</legend>
                {
                    values && values.map((value, index) => {
                        return <label key={`${value}-${index}`}>
                            <input 
                            type="checkbox" 
                            name={`Specification:use-${name}-as-value`} 
                            value={value} 
                            checked={!!enabledValues[index]}
                            onChange={(() => {
                                setEnabledValues(prev =>
                                    prev.map((col, colIndex) => colIndex === index ? !col : col )
                                )
                            })}/>
                            {value}
                        </label>
                    })
                }
            </fieldset>
        </details>
    )
}