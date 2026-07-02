'use client'
import { Picker, PickerItem } from "@react-spectrum/s2/Picker";
import { Button, Content, Dialog, DialogTrigger, Heading } from "@react-spectrum/s2/Dialog";
import { Divider } from "@react-spectrum/s2/Divider";
import { Key, useState } from "react"

export default function HeaderTypesModal({ rowsType, colsType, changeColsType, changeRowsType }: {
    rowsType: string,
    colsType: string,
    changeColsType: (newType: "text" | "date" | "time") => void,
    changeRowsType: (newType: "text" | "date" | "time") => void,
}) {
    const [currentRowsType, setCurrentRowsType] = useState<string>(rowsType);
    const [currentColsType, setCurrentColsType] = useState<string>(colsType);

    const handleRowChange = (value: Key | null) => {
        if (value) {
            setCurrentRowsType(value.toString());
            changeRowsType(value.toString() as "text" | "date" | "time");
        }
    }
    const handleColChange = (value: Key | null) => {
        if (value) {
            setCurrentColsType(value.toString());
            changeColsType(value.toString() as "text" | "date" | "time");
        }
    }
    return (
        <DialogTrigger>
            <Button variant="primary">Headers Type</Button>
            <Dialog isDismissible={true} isKeyboardDismissDisabled={true}>
                {
                    () => (
                        <>
                            <Heading slot="title">Headers Type</Heading>
                            <Content>
                                <section className="w-full my-4">
                                    <h4>Row headers type</h4>
                                    <Picker value={currentRowsType} onChange={handleRowChange}>
                                        <PickerItem id="text">Text</PickerItem>
                                        <PickerItem id="date">Date</PickerItem>
                                        <PickerItem id="time">Time</PickerItem>
                                    </Picker>
                                </section>

                                <Divider />

                                <section className="w-full my-4">
                                    <h4>Column headers type</h4>
                                    <Picker value={currentColsType} onChange={handleColChange}>
                                        <PickerItem id="text">Text</PickerItem>
                                        <PickerItem id="date">Date</PickerItem>
                                        <PickerItem id="time">Time</PickerItem>
                                    </Picker>
                                </section>
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}