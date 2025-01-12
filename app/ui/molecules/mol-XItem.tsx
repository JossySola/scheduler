"use client"

export default function XItem ({ name, criteria } : {
    name: string,
    criteria: Array<string>
}) {
    return (
        <details>
            <summary>{name}</summary>
                <input type="text" name="name" value={`${name}-criteria`} hidden readOnly />

                <label>
                    Disable
                    <input type="radio" name={`do-not-use-${name}-on-table`} value="Yes" />
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
                            return <input type="checkbox" name={`${name}-should-appear-on-${variable}`} value={variable} />
                        })
                    }
                </fieldset>

                <label>
                    How many times it should appear?
                    <input type="number" name={`${name}-should-appear-this-amount`} min={0} max={criteria.length} />
                </label>
        </details>
    )
}