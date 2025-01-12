"use client"

import { SubmitButton } from "../atoms/atom-button"

export default function XItem ({ name, criteria } : {
    name: string,
    criteria: Array<string>
}) {
    return (
        <details>
            <summary>{name}</summary>
            <form>
                <input type="text" name="name" readOnly>{name}</input>
                <label>
                    Disable
                    <input type="radio" name="disable-true">Yes</input>
                    <input type="radio" name="disable-false" checked>No</input>
                </label>
                <label>
                    <select>
                        <option></option>
                    </select>
                </label>
                <fieldset>
                    <legend>Enable/disable in certain values:</legend>
                    {
                        criteria && criteria.map(variable => {
                            return <input type="checkbox" name={variable}>{variable}</input>
                        })
                    }
                </fieldset>
                <label>
                    How many times it should appear?
                    <input type="number" min={0} max={criteria.length}></input>
                </label>

                <SubmitButton text="Save"/>
            </form>
        </details>
    )
}