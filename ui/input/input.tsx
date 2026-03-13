"use client"
import { Input as AriaInput, InputProps } from "react-aria-components";

export default function Input(props: InputProps) {
    return <AriaInput 
    placeholder={props.placeholder}
    name={props.name}
    autoComplete={props.autoComplete}
    value={props.value}
    required={props.required}
    {...props}>
        { props.children }
    </AriaInput>
}