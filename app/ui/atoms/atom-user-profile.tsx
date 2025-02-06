import { auth } from "@/auth";

export default async function UserProfile() {
    const session = await auth();
    if (!session?.user || !session?.user.email) return null;
    
    const imageRequest = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/image`, {
        method: "GET",
        headers: {
            "user_email": session.user.email
        }
    });

    const image = await imageRequest.json();

    return (
        <section>
            {
                image.user_image ? <img src={image.user_image} /> : null
            }
            <h2>{session.user.name}</h2>
        </section>
    )
}