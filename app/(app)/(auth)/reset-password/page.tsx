import ResetForm from "./_components/reset-form";

export default async function ResetPage({ searchParams }: {
    searchParams: Promise<{ [key:string] : string | undefined }>
}) {
    const token = (await searchParams).token;
    const error = (await searchParams).error;

    if (error || !token) {
        return (
            <section>
                <h2>The token has expired or is invalid</h2>
            </section>
        )
    }
    return (
        <section>
            <ResetForm token={token} />
        </section>
    )
}