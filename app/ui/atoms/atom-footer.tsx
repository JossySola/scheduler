import FooterLegal from "./atom-legal";
import PowerWithAnthropic from "./atom-powered-anthropic";
import FooterContact from "./atom-footer-contact";
import FooterCookies from "./atom-footer-cookie";

export default async function Footer () {
    return <footer className="w-full flex flex-row justify-center items-center gap-1 sm:gap-3 p-5 sm:p-3 fixed bottom-0 bg-transparent z-10">
        <FooterContact />
        <PowerWithAnthropic />
        <FooterLegal />
    </footer>
}