import { sendEmailSchema } from "@/lib/schemas";
import { Resend } from 'resend';
import z from "zod";
import { TemplateLink, TemplateNoLink } from "../../components/emailTemplates";

export default async function sendEmail({ to, subject, text, url, linkText }: { 
    to: string, 
    subject: string, 
    text: string, 
    url?: string, 
    linkText?: string }): Promise<void> {
    try {
        const verification = sendEmailSchema.safeParse({
            to,
            subject,
            text,
            url,
            linkText,
        });
        if (!verification.success) throw new Error(`${z.prettifyError(verification.error)}`);
        const key = process.env.RESEND_API_KEY;
        if (!key) throw new Error("Key missing");
        const resend = new Resend(key);

        const { data, error } = await resend.emails.send({
            from: 'Scheduler <no-reply@jossysola.com>',
            to: [to],
            subject,
            react: url && linkText ? TemplateLink(text, url, linkText) : TemplateNoLink(text),
        });
        if (error) throw new Error(`${error}`);
    } catch (error) {
        console.error(error);
        throw new Error(`Unsuccessful send mail action: ${error}`);
    }
}