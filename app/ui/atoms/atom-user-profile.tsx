import { auth } from "@/auth";
import UserBadge from "./atom-user-badge";

export default async function UserProfile() {
    const session = await auth();
    if (!session?.user || !session?.user.email || !session.user.name) return null;
    
    const imageRequest = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/image`, {
        method: "GET",
        headers: {
            "user_email": session.user.email
        }
    });

    const image = (await imageRequest.json()).user_image;

    return (
        <section className="mb-5">
            <UserBadge name={session.user.name} image={image} email={session.user.email}/>
        </section>
    )
}