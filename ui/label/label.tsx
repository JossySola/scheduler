"use client"

import { Label as AriaLabel, LabelProps } from "react-aria-components";

export default function Label(props: LabelProps) {
    return <AriaLabel {...props}>{ props.children }</AriaLabel>
}