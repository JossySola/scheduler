"use client"
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Claude } from "../atoms/atom-anthropic";
import { Button, Link } from "@heroui/react";

export default function Steps() {
    const params = useParams<{ lang: "en" | "es" }>();
    const { lang } = params;
    return (
        <section className="flex flex-col items-center gap-[40vh] mx-10 mt-[40vh] mb-[20vh]">
            <motion.h2 initial={{ scale: 0.5 }} whileInView={{ scale: 1 }} className="w-full text-center">
            {
                lang === "es" 
                ? "Sólo en 🖐🏾 pasos"
                : "Just in 🖐🏾 steps" 
            }
            </motion.h2>

            <motion.div 
            initial={{ opacity: 0, transform: "translateY(150px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)", transition: { delay: 0.5 } }}
            className="flex flex-col justify-center items-center gap-5">
            <h3>
                {
                lang === "es" 
                ? "Empieza añadiendo filas y columnas"
                : "Start by adding the rows and columns you need" 
                }
            </h3>
            <video autoPlay={true} loop muted playsInline preload="metadata" className="max-w-[732px] w-full rounded-xl shadow-xl/30">
                <source src="/assets/rows.mp4" type="video/mp4" />
                Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
            </video>
            </motion.div>
            

            
            <motion.div 
            initial={{ opacity: 0, transform: "translateY(150px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)", transition: { delay: 0.5 } }}
            className="flex flex-col justify-center items-center gap-5">
            <h3>
                {
                lang === "es" 
                ? "Asigna los tipos de encabezados y sus valores"
                : "Set the column headers' type and their values" 
                }
                
            </h3>
            <video autoPlay={true} loop muted playsInline preload="metadata" className="max-w-[732px] w-full rounded-xl shadow-xl/30">
                <source src="/assets/headers-panel.mp4" type="video/mp4" />
                Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
            </video>
            </motion.div>
            
            
            <motion.div 
            initial={{ opacity: 0, transform: "translateY(150px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)", transition: { delay: 0.5 } }}
            className="flex flex-col justify-center items-center gap-5">
            <h3>
                {
                lang === "es" 
                ? "Añade los valores que usarás"
                : "Add the values you'll use" 
                }
            </h3>
            <div className="w-[364px] h-auto rounded-xl overflow-hidden shadow-xl/30">
                <video autoPlay={true} loop muted playsInline preload="metadata" className="w-full object-[53%_100%] object-cover aspect-[5/11.5] ">
                <source src="/assets/values.mp4" type="video/mp4" />
                Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
                </video>
            </div>
            </motion.div>
            

            <motion.div 
            initial={{ opacity: 0, transform: "translateY(150px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)", transition: { delay: 0.5 } }}
            className="flex flex-col justify-center items-center gap-5">
            <h3>
                {
                lang === "en" 
                ? "Set the specifications you need"
                : "Configura los ajustes que necesitas" 
                }
            </h3>        
            <div className="w-[364px] h-auto rounded-xl overflow-hidden shadow-xl/30">
                <video autoPlay={true} loop muted playsInline preload="metadata" className="w-full object-[53%_100%] object-cover aspect-[5/11.5] ">
                <source src="/assets/generate.mp4" type="video/mp4" />
                Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
                </video>
            </div>
            </motion.div>
            

            <motion.div 
            initial={{ opacity: 0, transform: "translateY(150px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)", transition: { delay: 0.5 } }}
            className="flex flex-col justify-center items-center gap-5 text-center">
            <h3>
                {
                lang === "en" 
                ? <>Hit the 'Generate' button and let Claude <Claude /> <a href="#legal-1"><sup className="text-tiny">1</sup></a> give you a strategic schedule <a href="#legal-2"><sup className="text-tiny">2</sup></a> based on the specifications</>
                : <>Haz click en el botón 'Generar' y deja que Claude <Claude /> <a href="#legal-1"><sup className="text-tiny">1</sup></a> haga un horario estratégico <a href="#legal-2"><sup className="text-tiny">2</sup></a> basado en las especificaciones</>
                }
            </h3>
            <video autoPlay={true} loop muted playsInline preload="metadata" className="max-w-[732px] w-full rounded-xl shadow-xl/30">
                <source src="/assets/result.mp4" type="video/mp4" />
                Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
            </video>
            </motion.div>

            <div className="flex flex-col items-center w-full text-3xl text-center gap-10 mb-10">
                <p>
                    {
                    lang === "es"
                    ? <>Podrás crear, modificar y eliminar tus horarios <a href="#legal-3"><sup className="text-tiny">3</sup></a> en cualquier momento</>
                    : <>You will be able to create, modify and delete your schedules <a href="#legal-3"><sup className="text-tiny">3</sup></a> at any time</>    
                    }
                </p>
                <p>
                    {
                    lang === "es" 
                    ? <>¡Regístrate gratis! <a href="#legal-4"><sup className="text-tiny">4</sup></a> 😊</>
                    : <>Sign up for free! <a href="#legal-4"><sup className="text-tiny">4</sup></a> 😊</>
                    }
                </p>
                <Button as={ Link } href={`${lang}/signup`} className="bg-linear-to-tr from-violet-600 to-blue-500 text-white shadow-lg text-3xl p-8" 
                style={{
                    textDecorationLine: "none"
                }}>
                    { lang === "es" ? "Registrarse" : "Sign Up" }
                </Button>
            </div>
        </section>
    )
}