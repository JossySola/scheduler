import { auth } from "@/auth";

export default async function UserProfile() {
    const session = await auth();
    
    if (!session?.user) return null;

    return (
        <section>
            <h2>{session.user.name}</h2>
            <h4>{session.user.email}</h4>
            {
                session.user.image ? <img src={session.user.image} /> : null
            }
            {
                session.user.picture ? <img src={session.user.picture} /> : null
            }
        </section>
    )
}