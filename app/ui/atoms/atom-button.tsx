"use client"
import { Button, Link } from "@heroui/react";
import { PressEvent } from "@react-types/shared";

export function ActionButton ({ children, type = "button", color, loading = false, disabled = false, className, endContent, onPress, formAction, form }: {
    children: string,
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    type?: "button" | "submit",
    className?: string,
    disabled?: boolean,
    loading?: boolean,
    endContent?: React.JSX.Element,
    onPress?: (e: PressEvent) => void,
    formAction?: (payload: FormData) => void,
    form?: string,
}) {
    if (formAction) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            color={ color }
            endContent={ endContent && endContent }
            formAction={ formAction }
            form={ form && form }
            className={ !color ? `${className && className} dark:bg-white bg-black dark:text-black text-white p-5 text-md border-2 m-2` : "text-md m-2" }>
            { children }
            </Button>
        )
    }
    if (onPress) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            color={ color }
            endContent={ endContent && endContent }
            onPress={(e) => onPress(e)}
            className={ !color ? `${className && className} dark:bg-white bg-black dark:text-black text-white p-5 text-md border-2 m-2` : "text-md m-2" }>
            { children }
            </Button>
        )
    }
    return (
        <Button
        isDisabled={ disabled }
        isLoading={ loading }
        type={ type }
        color={ color }
        endContent={ endContent && endContent }
        className={ !color ? `${className && className} dark:bg-white bg-black dark:text-black text-white p-5 text-md border-2 m-2` : "text-md m-2" }>
            { children }
        </Button>
    )
}
export function SecondaryButton ({ children, type = "button", color, loading = false, disabled = false, className, startContent, endContent, onPress, formAction, form }: {
    children: string,
    type?: "button" | "submit",
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    className?: string,
    disabled?: boolean,
    loading?: boolean,
    startContent?: React.JSX.Element,
    endContent?: React.JSX.Element,
    onPress?: (e: PressEvent) => void,
    formAction?: (payload: FormData) => void,
    form?: string,
}) {
    if (formAction) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            color={ color }
            startContent={ startContent && startContent }
            endContent={ endContent && endContent }
            formAction={ formAction }
            form={ form && form }
            variant="ghost"
            className={ !color ? `${className && className} m-5` : "text-md m-5" }>
                { children }
            </Button>
        )
    }
    if (onPress) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            color={ color }
            startContent={ startContent && startContent }
            endContent={ endContent && endContent }
            onPress={ onPress }
            variant="ghost"
            className={ !color ? `${className && className} m-5` : "text-md m-5" }>
                { children }
            </Button>
        )
    }
    return (
        <Button
        isDisabled={ disabled }
        isLoading={ loading }
        type={ type }
        color={ color }
        startContent={ startContent && startContent }
        endContent={ endContent && endContent }
        variant="ghost"
        className={ !color ? `${className && className} m-5` : "text-md m-5" }>
            { children }
        </Button>
    )
}
export function PrimaryButton ({ children, type = "button", loading = false, disabled = false, className, startContent, endContent, onPress, formAction, form }: {
    children: string,
    type?: "button" | "submit",
    className?: string,
    disabled?: boolean,
    loading?: boolean,
    startContent?: React.JSX.Element,
    endContent?: React.JSX.Element,
    onPress?: (e: PressEvent) => void,
    formAction?: (payload: FormData) => void,
    form?: string,
}) {
    if (formAction) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            startContent={ startContent && startContent }
            endContent={ endContent && endContent }
            formAction={ formData => formAction(formData) }
            form={ form && form }
            className={`${className && className} bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg m-5`}>
                { children }
            </Button>
        )
    }
    if (onPress) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            startContent={ startContent && startContent }
            endContent={ endContent && endContent }
            onPress={ onPress }
            className={`${className && className} bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg m-5`}>
                { children }
            </Button>
        )
    }
    return (
        <Button
        isDisabled={ disabled }
        isLoading={ loading }
        type={ type }
        startContent={ startContent && startContent }
        endContent={ endContent && endContent }
        className={`${className && className} bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg m-5`}>
            { children }
        </Button>
    )
}
export function PrimaryButtonAsLink ({ children, startContent, endContent, link } : {
    children: string,
    link: string,
    startContent?: React.JSX.Element,
    endContent?: React.JSX.Element
}) {
    return (
        <Button
        startContent={ startContent && startContent }
        endContent={ endContent && endContent }
        as={ Link }
        href={ link }
        className="bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg">
            { children }
        </Button>
    )
}
