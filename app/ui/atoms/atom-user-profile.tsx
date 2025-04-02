import { auth } from "@/auth";
import UserBadge from "./atom-user-badge";

export default async function UserProfile() {
    const session = await auth();
    if (session && session.user && session.user.name && session.user.email) {
        return <UserBadge name={ session.user.name } image={ session.user.image ? session.user.image : "" } email={ session.user.email } />
    }
}