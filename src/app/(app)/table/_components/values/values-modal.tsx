'use client'
import { ListView, ListViewItem, type Selection } from '@react-spectrum/s2/ListView';
import { Button, Content, Dialog, DialogTrigger, Heading } from "@react-spectrum/s2/Dialog";
import { TextField } from "@react-spectrum/s2/TextField";
import { useState } from "react";
import { ButtonContext, DEFAULT_SLOT, Provider } from 'react-aria-components';
import { ActionBar, ActionButton } from '@react-spectrum/s2/ActionBar';
import Delete from '@react-spectrum/s2/icons/Delete';

const actionBarButtonContext = {
    slots: {
        [DEFAULT_SLOT]: {},
        close: {}
    }
};
export default function ValuesModal({ addValue, replaceValues, deleteValue, editValue, values }: {
    addValue: (value: string) => boolean,
    replaceValues: (newValues: Set<string>) => void,
    deleteValue: (value: string) => boolean,
    editValue: (pastValue: string, newValue: string) => boolean,
    values: Set<string>,
}) {
    const [input, setInput] = useState("");
    const [selected, setSelected] = useState<Selection>(new Set());
    
    const handleDeleteValue = (selection: string) => {
        const newSet = new Set(Array.from(values));
        if (selection === "all") {
            newSet.clear();
        }
        if (selection.includes(",")) {
            const splatString = selection.split(",");
            splatString.forEach(value => newSet.delete(value.trim()));
        }
        newSet.delete(selection);
        setSelected(new Set([]));
        replaceValues(newSet);
    }

    return (
        <DialogTrigger>
            <Button variant="primary">Values</Button>
            <Dialog isDismissible={true} isKeyboardDismissDisabled={true}>
                {
                    () => (
                        <>
                            <Heading slot="title">Values</Heading>
                            <Content>
                                <TextField aria-label='Values' value={input} onChange={setInput} />
                                <Button type="button" onPress={() => {
                                    addValue(input);
                                    setInput("");
                                }}>Add value</Button>
                                <section>
                                    <ListView
                                    aria-label='Values'
                                    selectionMode='multiple'
                                    selectedKeys={selected}
                                    onSelectionChange={setSelected}
                                    renderActionBar={(selectedKeys) => {
                                        let selection = selectedKeys === 'all' ? 'all' : [...selectedKeys].join(', ');
                                        return (
                                            <Provider values={[[ButtonContext, actionBarButtonContext]]}>
                                                <ActionBar>
                                                    <ActionButton aria-label="Delete" onPress={() => handleDeleteValue(selection)}>
                                                        <Delete />
                                                    </ActionButton>
                                                </ActionBar>
                                            </Provider>
                                        );
                                    }}>
                                    {
                                        values && Array.from(values).map((value, index) => (
                                            <ListViewItem id={`${value}`} key={`${value}.${index}`}>
                                                { value }
                                            </ListViewItem>
                                        ))
                                    }
                                    </ListView>
                                </section>
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}