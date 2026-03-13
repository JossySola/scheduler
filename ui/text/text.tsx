"use client"
import { Text as AriaText, TextProps } from "react-aria-components";

export default function Text(props: TextProps) {
    return <AriaText slot={props.slot}>{ props.children }</AriaText>
}