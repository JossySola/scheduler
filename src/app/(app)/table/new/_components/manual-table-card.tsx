'use client'
import { Card, CardPreview, Content, Image, Text } from "@react-spectrum/s2/Card"

export default function ManualTableOption() {
    return (
        <div>
            <Card>
                <CardPreview>
                    <Image src="https://react-spectrum.adobe.com/preview.c3b340d3.png" />
                </CardPreview>
                <Content>
                    <Text slot="title">Manual Creation</Text>
                    <Text slot="description">Create a table manually with an optional tool of AI assistance</Text>
                </Content>
            </Card>
        </div>
    )
}