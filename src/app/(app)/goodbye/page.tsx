import { getTranslations } from "next-intl/server";

export default async function GoodbyePage() {
    const translation = await getTranslations("goodbye");
    return (
        <section>
            <h2>{translation("h2")}</h2>
            <p>{translation("p")}</p>
        </section>
    )
}