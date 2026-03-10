import { authClient } from "@/features/(auth)/auth-client";
import { useRouter } from "next/navigation";

export default async function() {
    const router = useRouter();
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.push("/login");
            }
        }
    })
}