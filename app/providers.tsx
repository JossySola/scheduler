"use client"
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

export function UIProvider ({ children }: {
    children: React.ReactNode,
}) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <ToastProvider placement='bottom-center' />
            { children }
        </HeroUIProvider>
    )
}