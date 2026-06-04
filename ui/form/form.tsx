"use client"
import { Form as AriaForm, FormProps } from "react-aria-components";

export default function Form(props: FormProps) {
    return <AriaForm className='flex flex-col gap-6' {...props}>{ props.children }</AriaForm>
}