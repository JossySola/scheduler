"use client"
import { Form as AriaForm, FormProps } from "react-aria-components";

export default function Form(props: FormProps) {
    return <AriaForm {...props}>{ props.children }</AriaForm>
}