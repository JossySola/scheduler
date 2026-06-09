'use client'
import {Card, CardPreview, Image, Content, Text, Footer} from '@react-spectrum/s2/Card';

export default function AiOptionCard() {
    return (
        <Card>
            <CardPreview>
                <Image src="https://react-spectrum.adobe.com/preview.c3b340d3.png" />
            </CardPreview>
            <Content>
                <Text slot="title">AI Prompt</Text>
                <Text slot="description">Type what you want the AI to generate and add the values to be used</Text>
            </Content>
        </Card>
    )
}