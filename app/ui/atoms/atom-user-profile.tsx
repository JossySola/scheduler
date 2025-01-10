import { auth } from "@/auth";

export default async function UserProfile() {
    const session = await auth();
    
    if (!session?.user) return null;

    return (
        <section>
            {
                session.user.image ? <img src={session.user.image} /> : null
            }
            <h2>{session.user.name}</h2>
        </section>
    )
}