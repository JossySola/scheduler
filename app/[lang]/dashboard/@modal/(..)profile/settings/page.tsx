import Modal from "@/app/ui/molecules/mol-modal";
import Settings from "@/app/ui/molecules/mol-settings";

export default async function SettingsModal ({ params }: {
    params: Promise<{ lang: string }>
}) {
    const lang = (await params).lang;
    return (
        <Modal lang={lang} >
            <Settings />
        </Modal>
    )
}