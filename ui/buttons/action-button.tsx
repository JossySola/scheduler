"use client"
import { Button, ButtonProps } from "react-aria-components"

export default function ActionButton({...props}: ButtonProps) {
    return (
        <Button type={props.type} {...props}>
            { props.children }
        </Button>
    )
}