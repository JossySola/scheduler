"use client"
import { useEffect, useState } from "react";

export default function XItem ({ name, preferences, criteria = [], values = []} : {
    name: string,
    criteria: Array<string>,
    preferences?: Array<Array<string>>,
    values?: Array<string>,
}) {
    const [ count, setCount ] = useState<number>(criteria.length);
    const [ disable, setDisable ] = useState<boolean>(() => {
        if (preferences) {
            const result = preferences.find(subArray => subArray[0] === `Specification[${name}]-disable-on-table`);
            if (result) {
                return true;
            }
        }
        return false;
    });
    const [ enabledColumns, setEnabledColumns ] = useState<Array<boolean>>(criteria.map(() => {
        if (preferences) {
            const result = preferences.find(subArray => subArray[0] === `Specification[${name}]-should-be-used-on`);
            if (result) {
                return true;
            }
        }
        return false;
    }));
    const [ enabledValues, setEnabledValues ] = useState<Array<boolean>>(values.map(() => {
        if (preferences) {
            const result = preferences.find(subArray => subArray[0] === `Specification[${name}]-use-this-as-value`);
            if (result) {
                return true;
            }
        }
        return false;
    }));

    useEffect(() => {
        setCount(prevCount => (prevCount === criteria.length ? criteria.length : prevCount));
        setEnabledColumns(criteria.map(() => false));
    }, [criteria]);
    
    useEffect(() => {
        setEnabledValues(values.map(() => false));
    }, [values]);

    return (
        <details>
            <summary>{name}</summary>
            <label>
                Disable on all columns:
                <input 
                type="radio" 
                name={`Specification[${name}]-disable-on-table`} 
                value="Yes" 
                checked={disable} 
                onChange={() => setDisable(prev => !prev)}/>
            </label>

            <fieldset>
                <legend>Enable/disable in certain columns:</legend>
                {
                    criteria && criteria.map((variable, index) => {
                        return <label key={`${variable}-${index}`}>
                            <input 
                            type="checkbox" 
                            name={`Specification[${name}]-should-be-used-on`} 
                            value={variable} 
                            checked={!!enabledColumns[index]}
                            onChange={(e => {
                                e.preventDefault();
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
                How many times it should appear (randomly)?
                <input 
                type="number" 
                name={`Specification[${name}]-should-appear-this-amount-of-times`} 
                min={0}
                max={criteria.length} 
                value={count} 
                onChange={e => {
                    e.preventDefault();
                    setCount(parseInt(e.target.value, 10) || 0);
                }}/>
            </label>
            
            <fieldset>
                <legend>Prefer the following values:</legend>
                {
                    values && values.map((value, index) => {
                        return <label key={`${value}-${index}`}>
                            <input 
                            type="checkbox" 
                            name={`Specification[${name}]-use-this-as-value`} 
                            value={value} 
                            checked={!!enabledValues[index]}
                            onChange={(e => {
                                e.preventDefault();
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