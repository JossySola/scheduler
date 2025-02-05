import { auth } from "@/auth";
import DisconnectGoogle from "../atoms/atom-disconnect-google";
import DisconnectFacebook from "../atoms/atom-disconnect-facebook";

export default async function DisconnectProviders () {
    const session = await auth();

    if (session?.user && session.user.email) {
        const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/providers`, {
            method: "GET",
            headers: {
                "user_email": session.user.email
            }
        })
        const response = await request.json();

        return (
            <section>
                {
                    response.data && response.data.map((row: { provider: string }) => {
                        if (row.provider === "Google") {
                            return <DisconnectGoogle key={row.provider} />
                        }
                        if (row.provider === "Facebook") {
                            return <DisconnectFacebook key={row.provider} />
                        }
                    })
                }
            </section>
        )
    }
}