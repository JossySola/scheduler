import { Code, Divider } from "@heroui/react";
import Link from "next/link";

export default async function Page ({ params }: {
    params: Promise<{ lang: "es" | "en"}>
}) {
    const lang = (await params).lang;
    return (
        <section className="p-10 pb-[6rem] text-base/7 h-fit">

            <h1>Terms of Use</h1>

            <i>Effective Date: April 8th, 2025.</i>
            <Divider className="my-4" />
            <h2>1. Acceptance of Terms</h2>
            
            <p>By accessing and using Scheduler ("the web app"), you agree to comply with these Terms of Use. If you do not agree, you may not use the service.</p>
           
            <h2>2. Account Registration & Security</h2>

            <ul className="pl-8 list-disc">
                <li>You must provide accurate and complete information when registering.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You must not share your account with others or use another user’s account.</li>
            </ul>

            <h2>3. Password Policy</h2>
            
            <ul className="pl-8 list-disc">
                <li>Your password must be at least 8 characters long.</li>
                <li>It is highly recommended to use the Password Manager’s suggestion, as it is able to offer the strongest password suggestions.</li>
                <li>All passwords are checked against a public <Code size="sm">database of exposed passwords <a href="#footer"><sup>1</sup></a></Code> for security, hashed using <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> and encrypted before storage.</li>
            </ul>

            <h2>4. User-Generated Content (Schedules & Tables)</h2>
            
            <ul className="pl-8 list-disc">
                <li>You retain ownership of the schedules and tables you create.</li>
                <li>All schedules and tables are encrypted <a href="#footer"><sup>3</sup></a> using strong encryption algorithms before storage.</li>
                <li>You may delete your schedules at any time.</li>
            </ul>
            
            <h2>5. Account Deletion & Data Removal</h2>
            
            <ul className="pl-8 list-disc">
                <li>You may delete your account at any time, which will erase all linked data and disconnect any linked providers.</li>
                <li>You may disconnect your account from Google or Facebook without deleting your account.</li>
            </ul>
            
            <h2>6. Use of Artificial Intelligence</h2>

            <ul className="pl-8 list-disc">
                <li>Our web app provides <Code size="sm">AI-generated <a href="#footer"><sup>4</sup></a></Code> scheduling assistance through an external service.</li>
                <li>We do not guarantee the accuracy, reliability, or effectiveness of AI-generated schedules.</li>
                <li>By using the "Generate" AI feature, you agree to their <Link href="https://www.anthropic.com/legal/consumer-terms">Terms & Conditions</Link>.</li>
            </ul>

            <h2>7. Prohibited Activities</h2>
            
            <p>When using our web app, you agree NOT to:</p>
            
            <ul className="pl-8 list-disc">
                <li>Use the service for illegal, fraudulent, or harmful activities.</li>
                <li>Attempt to gain unauthorized access to other accounts and/or confidential data.</li>
                <li>Interfere with the platform’s functionality (e.g., hacking, exploiting vulnerabilities).</li>
            </ul>
            
            <h2>8. Limitation of Liability</h2>
            
            <p>We provide this web app on an "as-is" basis. While we take security seriously, we are not responsible for:</p>
            
            <ul className="pl-8 list-disc">
                <li>Any data loss due to unexpected system failures.</li>
                <li>Unauthorized access caused by weak user passwords or user negligence.</li>
                <li>AI-generated scheduling inaccuracies.</li>
            </ul>

            <h2>9. Termination of Access</h2>
            
            <p>We reserve the right to terminate or suspend access to your account if you violate these terms.</p>
            

            <h2>10. Updates to These Terms</h2>

            <p>We may update these Terms of Use at any time. If significant changes occur, we will notify users via email or an in-app notification.</p>

            <h2>11. Contact Information</h2>
            
            <p>If you have any questions or concerns about these terms, please contact us {<Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`}>here</Link>}.</p>
            <Divider className="my-4"/>
            <footer className="text-tiny dark:bg-[#1A1A1A]" id="footer">
                <p><sup>1</sup> <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> is a service that provides a list of passwords previously exposed in data breaches. This is used to avoid the use of unsuitable passwords. From our side, we check your password against a public database of exposed passwords (Have I Been Pwned) using a privacy-preserving method that ensures your password is never fully revealed.</p>
                <p><sup>2</sup> <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> is a hybrid version of <b>Argon2</b>, which is a key derivation function used to hash passwords.</p>
                <p><sup>3</sup> Sensitive data is encrypted before being stored in our database using a strong encryption algorithm and securely managed keys.</p>
                <p><sup>4</sup> <Link href="https://www.anthropic.com/legal/privacy">Anthropic Privacy Policy.</Link> For AI-related features, we use a privacy-compliant language model provided by Anthropic.</p>
            </footer>
        </section>
    )
}