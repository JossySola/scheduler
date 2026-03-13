"use client"

import { TextField as AriaTextField, TextFieldProps } from "react-aria-components";

export default function TextField(props: TextFieldProps) {
    return <AriaTextField {...props}>{ props.children }</AriaTextField>
}