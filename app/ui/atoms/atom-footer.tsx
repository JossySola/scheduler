import FooterLegal from "./atom-legal";
import PowerWithAnthropic from "./atom-powered-anthropic";
import FooterContact from "./atom-footer-contact";

export default async function Footer () {
    return <footer className="w-full flex flex-row justify-center items-center gap-3 p-3 fixed bottom-0 bg-transparent">
        <FooterContact />
        <PowerWithAnthropic />
        <FooterLegal />
    </footer>
}