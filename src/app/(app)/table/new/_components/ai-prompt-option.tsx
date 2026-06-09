'use client'
import { useState } from "react";
import AiOptionCard from "./ai-option-card";
import {Dialog, DialogTrigger, Button, ButtonGroup, Heading, Content, Footer} from '@react-spectrum/s2/Dialog';
import {TextArea} from '@react-spectrum/s2/TextArea';
import List from "@/ui/list-view/list-view";

export default function AiPromptOption() {
    const [prompt, setPrompt] = useState<string>("");
    const [values, setValues] = useState<Set<string>>(new Set());
    const [columnHeaders, setColumnHeaders] = useState<Set<string>>(new Set());
    const [rowHeaders, setRowHeaders] = useState<Set<string>>(new Set());
    return (
        <DialogTrigger>
            <Button><AiOptionCard /></Button>
            <Dialog isDismissible={true} isKeyboardDismissDisabled={true}>
                {
                    ({ close }) => (
                        <>
                            <Heading slot="title">AI Prompt</Heading>
                            <Content>
                                <h4>Prompt</h4>
                                <TextArea 
                                aria-label="Prompt to AI" 
                                placeholder="Start writing the schedule you want, what constraints and specifications you need, what should be prioritized, and any valuable information to help the AI return the most optimized schedule for you!"
                                value={prompt}
                                onChange={setPrompt}
                                isRequired />
                                
                                <section id="Values list">
                                    <List name="Values" values={values} setValues={setValues} />
                                </section>
                                <section id="Column headers">
                                    <List name="Column Headers" values={columnHeaders} setValues={setColumnHeaders} />
                                </section>
                                <section id="Row Headers">
                                    <List name="Row Headers" values={rowHeaders} setValues={setRowHeaders} />
                                </section>
                            </Content>
                        </>
                    )
                }
            </Dialog>
        </DialogTrigger>
    )
}