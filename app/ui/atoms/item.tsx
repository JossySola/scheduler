'use client';

import { SubmitButton } from "./button";

export default function Item_Preferences({
    name = 'Unknown',
    disabled = false,
    range = {
        from: '',
        to: '',
    },
    avoidColumns = [],
    avoidRows = [],
}) {
    return (
        <form>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" id="name" defaultValue={name} required/>

            <label><input type="radio" name="disabled" value="false" /> Enable</label>
            <label><input type="radio" name="disabled" value="true" /> Disable</label>

            <fieldset>
                <legend>Preferred Range:</legend>
                <label htmlFor="from">From:</label>
                <input type="text" name="from" id="from" defaultValue={range.from}/>
                <label htmlFor="to">To:</label>
                <input type="text" name="to" id="to" defaultValue={range.to}/>
            </fieldset>

            <label htmlFor="avoidColumn">Avoid this column:</label>
            <input type="text" name="avoidColumn" id="avoidColumn"/>

            <label htmlFor="avoidRow">Avoid this row:</label>
            <input type="text" name="avoidRow" id="avoidRow"/>

            <SubmitButton name="save" value="save" text="Save"/>
        </form>
    )
}