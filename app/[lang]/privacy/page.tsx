import { Code, Divider } from "@heroui/react";
import Link from "next/link";

export default async function Page ({ params }: {
    params: Promise<{ lang: "es" | "en" }>
}) {
    const lang = (await params).lang;
    return (
        <section className="p-10 pb-[6rem] text-base/7 h-fit">
            
            <h1>Privacy Policy</h1>

            <i>Effective Date: April 9th, 2025.</i>
            <Divider className="my-4"/>
            <h2>1. Introduction</h2>

            <p>Welcome to Scheduler ("we," "our," or "us"). Your privacy is important to us, and we are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our web application.</p>

            <h2>2. Data We Collect</h2>

            <p>When you register and use our web app, we collect the following personal data:</p>

            <ul className="pl-8 list-disc">
                <li><b>Mandatory Data:</b> Name, username, birthday, email, and password.</li>
                <li><b>Optional Data:</b> Profile picture (only if you sign in via Google or Facebook, and a profile picture is available).</li>
                <li><b>User-generated Data:</b> Schedules and tables you create and save.</li>
            </ul>

            <h2>3. How We Protect Your Data</h2>

            <p>We implement strict security measures to ensure your data remains secure:</p>

            <ul className="pl-8 list-disc">
                <li>
                    <h3>Password Security:</h3>
                    <ul className="pl-16 list-disc">
                        <li>Must be at least 8 characters long.</li>
                        <li>Recommended use of a Password Manager’s suggested password.</li>
                        <li>Checked against a public <Code size="sm">database of exposed passwords <a href="#footer"><sup>1</sup></a></Code> to verify it hasn’t been exposed in data breaches.</li>
                        <li>Hashed using <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> before storage (we never store raw passwords).</li>
                        <li>As a second security layer, the hashed password is encrypted before being stored in the database with a <b>UNIQUE</b> encryption key <a href="#footer"><sup>3</sup></a>.</li>
                    </ul>
                </li>
                <li>
                    <h3>Schedule Encryption:</h3>
                    <ul className="pl-16 list-disc">
                        <li>All schedules and tables are encrypted <a href="#footer"><sup>4</sup></a> using strong encryption algorithms before storage.</li>
                    </ul>
                </li>
            </ul>

            <h2>4. How We Use Your Data</h2>
            
            <p>We use your data solely for the purpose of providing and improving our web app. Specifically, we use it to:</p>
            
            <ul className="pl-8 list-disc">
                <li>Authenticate your access to the platform.</li>
                <li>Enable AI-assisted scheduling based on user input.</li>
                <li>Improve security and prevent fraud.</li>
                <li>Allow account management, including password changes and third-party provider connections (Google/Facebook).</li>
            </ul>
            
            <h2>5. Third-Party Services</h2>
            
            <p>We integrate external services to enhance our platform:</p>

            <ul className="pl-8 list-disc">
                <li><b>Authentication Providers:</b> Google and Facebook for sign-in options.</li>
                <li><b>Artificial Intelligence Service (Anthropic):</b> An external AI system assists in generating strategic schedules.</li>
            </ul>

            <i>These third-party services may collect data as per their own privacy policies. We encourage you to review their terms before connecting your account <a href="#footer"><sup>5</sup></a>.</i>

            <h2>6. User Control & Account Deletion</h2>

            <ul className="pl-8 list-disc">
                <li>
                    <b>Account Deletion:</b> You may delete your account at any time. This will:
                    <ul className="pl-8 list-disc">
                        <li>Remove all personal data (name, username, birthday, email, password).</li>
                        <li>Erase all stored schedules and tables.</li>
                        <li>Disconnect any linked providers (Google and/or Facebook).</li>
                    </ul>
                </li>
                <li><b>Disconnecting Providers:</b> You can manually disconnect your account from Google or Facebook without deleting your account.</li>
                <li><b>Password Change:</b> You can change your password at any time.</li>
                <li><b>Table creation:</b> You can create, modify, save and delete the tables you own in the platform at any time.</li>
            </ul>

            <h2>7. Data Retention</h2>

            <p>We store your data only as long as your account is active. If you delete your account, all personal data is permanently erased.</p>

            <h2>8. Children's Privacy</h2>
            
            <p>Our web app is not intended for individuals under the age of 13. If we become aware that a child under 13 has provided personal data, we will take immediate steps to delete the information.</p>

            <h2>9. Cookies</h2>

            <p>We only use <Code size="sm">Cookies <a href="#footer"><sup>6</sup></a></Code> for User's Authentication management.</p>

            <h2>10. User roles in the platform</h2>

            <p>All users in the database have the same privileges and options. This means there are no super-users or roles with special privileges within the platform that may be able to view and modify any of your data.</p>
            
            <h2>11. Updates to This Policy</h2>

            <p>We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email or within the web app.</p>

            <h2>12. Contact Us</h2>

            <p>If you have any questions about this Privacy Policy, please contact us {<Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`}>here</Link>}.</p>
            <Divider className="my-4"/>
            <footer className="text-tiny dark:bg-[#1A1A1A]" id="footer">
                <p className="mb-1">1 <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> is a service that provides a list of passwords previously exposed in data breaches. This is used to avoid the use of unsuitable passwords. From our side, we check your password against a public database of exposed passwords (Have I Been Pwned) using a privacy-preserving method that ensures your password is never fully revealed.</p>
                <p className="mb-1">2 <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> is a hybrid version of <b>Argon2</b>. We hash all passwords using Argon2id, a secure password hashing algorithm recommended by security experts.</p>
                <p className="mb-1">3 <Link href="https://docs.aws.amazon.com/kms/latest/developerguide/overview.html">AWS KMS</Link> is the <b>Key Management Service</b> provided by the <b>Amazon Web Services</b>. We use AWS’s secure key management infrastructure to encrypt sensitive data.</p>
                <p className="mb-1">4 Sensitive data is encrypted before being stored in our database using a strong encryption algorithm and securely managed keys.</p>
                <p className="mb-1">5 <Link href="https://www.anthropic.com/legal/privacy">Anthropic Privacy Policy.</Link> For AI-related features, we use a privacy-compliant language model provided by Anthropic.</p>
                <p className="mb-1">6 <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies">Cookies</Link> are small pieces of data a Server sends to the User's browser in order to preserve and manage information between the Client and the Server. In this case, we use Cookies to preserve and manage the User's authentication and session while using the application if they sign in.</p>
            </footer>
        </section>
    )
}