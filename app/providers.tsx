"use client"
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
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
            <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
                <ToastProvider placement='bottom-center' />
                    <main>
                        { children }
                    </main>
            </NextThemesProvider>
        </HeroUIProvider>
    )
}