"use client"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useParams } from 'next/navigation';

export default function Benefits () {
    const params = useParams<{ lang: "en" | "es"}>();
    const { lang } = params;
    return (
        <section className='w-full lg:w-[900px] p-5 flex flex-col justify-center items-center gap-20'>
            <section className="w-full flex flex-col md:flex-row justify-center items-center md:justify-between gap-10 text-center sm:text-left">
                <h3>
                    {
                        lang === "es"
                        ? "Se adapta a tus especificaciones"
                        : "Adapts to your constraints"
                    }
                </h3>
                <div className='max-w-[416px]'>
                    <DotLottieReact src="/assets/settings.lottie" autoplay />
                </div>
            </section>
            <section className="w-full flex flex-col sm:flex-row justify-center items-center md:justify-between gap-10 text-center sm:text-left">
                <h3>
                    {
                        lang === "es"
                        ? "Te da todo el control"
                        : "Gives you full control"
                    }
                </h3>
                <div className='max-w-[500px]'>
                    <DotLottieReact src='/assets/input-types.lottie' speed={0.5} autoplay loop />
                </div>
            </section>
            <section className="w-full flex flex-col sm:flex-row justify-center items-center md:justify-between gap-10 text-center sm:text-left">
                <h3>
                    {
                        lang === "es"
                        ? "Crece junto tu equipo"
                        : "Scales with your team"
                    }
                </h3>
                <div className='max-w-[500px]'>

                </div>
            </section>
        </section>
    )
}