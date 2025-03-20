import { Code, Divider } from "@heroui/react";
import Link from "next/link";

export default async function Page ({ params }: {
    params: Promise<{ lang: "es" | "en" }>
}) {
    const lang = (await params).lang;
    return (
        <section className="m-10 p-5 text-base/7">
            
            <h1>Privacy Policy</h1>

            <i>Effective Date: February 19th, 2025.</i>
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
                        <li>Checked against the <Code size="sm">Have I Been Pwned API <a href="#footer"><sup>1</sup></a></Code> to verify it hasn’t been exposed in data breaches.</li>
                        <li>Hashed using <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> before storage (we never store raw passwords).</li>
                        <li>As a second security layer, the hashed password is encrypted before being stored in the database.</li>
                    </ul>
                </li>
                <li>
                    <h3>Schedule Encryption:</h3>
                    <ul className="pl-16 list-disc">
                        <li>All schedules and tables are encrypted using <Code size="sm">BYTEA encryption <a href="#footer"><sup>3</sup></a></Code> before storage.</li>
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

            <i>These third-party services may collect data as per their own privacy policies. We encourage you to review their terms before connecting your account. <a href="#footer"><sup>4</sup></a></i>

            <h2>6. User Control & Account Deletion</h2>
            
            <p><b>Account Deletion:</b> You may delete your account at any time. This will:</p>

            <ul className="pl-8 list-disc">
                <li>Remove all personal data (name, username, birthday, email, password).</li>
                <li>Erase all stored schedules and tables.</li>
                <li>Disconnect any linked providers (Google and/or Facebook).</li>
                <li><b>Disconnecting Providers:</b> You can manually disconnect your account from Google or Facebook without deleting your account.</li>
                <li><b>Password Change:</b> You can change your password at any time.</li>
            </ul>

            <h2>7. Data Retention</h2>

            <p>We store your data only as long as your account is active. If you delete your account, all personal data is permanently erased.</p>

            <h2>8. Children's Privacy</h2>
            
            <p>Our web app is not intended for individuals under the age of 13. If we become aware that a child under 13 has provided personal data, we will take immediate steps to delete the information.</p>

            <h2>9. Updates to This Policy</h2>

            <p>We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email or within the web app.</p>

            <h2>10. Contact Us</h2>

            <p>If you have any questions about this Privacy Policy, please contact us {<Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`}>here</Link>}.</p>
            <Divider className="my-4"/>
            <footer className="text-tiny" id="footer">
                <p><sup>1</sup> <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> is a service that provides a list of passwords previously exposed in data breaches. This is used to avoid the use of unsuitable passwords.</p>
                <p><sup>2</sup> <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> is a hybrid version of <b>Argon2</b>, which is a key derivation function used to hash passwords.</p>
                <p><sup>3</sup> <Link href="https://www.postgresql.org/docs/current/pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-ENCRYPT">BYTEA encryption</Link> is the way we encrypt data before storing it into our database. The encryption and decryption of such data is done with a unique symmetric key/password.</p>
                <p><sup>4</sup> <Link href="https://www.anthropic.com/legal/privacy">Anthropic Privacy Policy.</Link> For the Artificial Intelligence Service, we use <Code className="text-tiny"><b>Anthropic: </b>claude-3-opus-20240229</Code></p>
            </footer>
        </section>
    )
}