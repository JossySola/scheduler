import { Button, Link } from "@heroui/react";
import { PressEvent } from "@react-types/shared";

export function ActionButton ({ children, type = "button", loading = false, disabled = false, className, endContent, onPress }: {
    children: string,
    type?: "button" | "submit",
    className?: string,
    disabled?: boolean,
    loading?: boolean,
    endContent?: React.JSX.Element,
    onPress?: (e: PressEvent) => void
}) {
    if (onPress) {
        return (
            <Button
            isDisabled={ disabled }
            isLoading={ loading }
            type={ type }
            endContent={endContent && endContent}
            onPress={(e) => onPress(e)}
            className={`${className && className} bg-white text-black w-fit text-md border-2 m-2`}>
            { children }
            </Button>
        )
    }
    return (
        <Button
        isDisabled={ disabled }
        isLoading={ loading }
        type={ type }
        endContent={ endContent && endContent }
        className={`${className && className} bg-white text-black w-fit text-md border-2 m-2`}>
            { children }
        </Button>
    )
}
export function SecondaryButton ({ children, type = "button", loading = false, disabled = false, className, startContent, endContent, onPress }: {
    children: string,
    type?: "button" | "submit",
    className?: string,
    disabled?: boolean,
    loading?: boolean,
    startContent?: React.JSX.Element,
    endContent?: React.JSX.Element,
    onPress?: (e: PressEvent) => void
}) {
    return (
        <Button
        isDisabled={ disabled }
        isLoading={ loading }
        type={ type }
        startContent={ startContent && startContent }
        endContent={ endContent && endContent }
        onPress={ onPress && onPress }
        className={`${className && className} text-md bg-black text-white border-2 m-2`}>
            { children }
        </Button>
    )
}
export function PrimaryButton ({ children, type = "button", loading = false, disabled = false, className, startContent, endContent, onPress }: {
    children: string,
    type?: "button" | "submit",
    className?: string,
    disabled?: boolean,
    loading?: boolean,
    startContent?: React.JSX.Element,
    endContent?: React.JSX.Element,
    onPress?: (e: PressEvent) => void
}) {
    return (
        <Button
        isDisabled={ disabled }
        isLoading={ loading }
        type={ type }
        startContent={ startContent && startContent }
        endContent={ endContent && endContent }
        onPress={ onPress && onPress }
        className={`${className && className} bg-gradient-to-tr from-violet-600 to-blue-500 text-white shadow-lg`}>
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
