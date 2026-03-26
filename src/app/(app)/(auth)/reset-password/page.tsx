import { getTranslations } from "next-intl/server";
import ResetForm from "./_components/reset-form";

export default async function ResetPage({ searchParams }: {
    searchParams: Promise<{ [key:string] : string | undefined }>
}) {
    const translation = await getTranslations("reset-form"); 
    const token = (await searchParams).token;
    const error = (await searchParams).error;

    if (error || !token) {
        return (
            <section>
                <h2>{translation("h2-page")}</h2>
            </section>
        )
    }
    return (
        <section>
            <ResetForm token={token} t={{
                label: translation("label"),
                placeholder: translation("placeholder"),
                button: translation("button")
            }} />
        </section>
    )
}