import { Divider } from "@heroui/react";
import Link from "next/link";
import { AnthropicTiny, ClaudeTiny } from "../ui/atoms/atom-anthropic";
import Benefits from "../ui/landing/benefits";

export default async function App ({ params }: {
  params: Promise<{ lang: "en" | "es" }>,
}) {
  const lang = (await params).lang;
  return (
    <main className="w-full flex flex-col justify-center items-center gap-3">
      <div className="w-full lg:w-[900px] p-5 flex flex-col items-center gap-10">
        <header className="flex flex-col justify-center items-center relative w-full text-center h-[80vh]">
          <div className="blur-sm absolute top-[35%] flex flex-inline items-start w-full h-full">
            <ColorStrains width={"100%"} />
          </div>
          <h1 className="z-3">
            {
              lang === "es" 
              ? "La IA hace el análisis, tu obtienes el horario estratégico."
              : "The AI does the thinking, you get the strategic schedule." 
            }
          </h1>
        </header>

        <h2 className="text-center w-full">
          {
            lang === "es" 
            ? "Planificación de trabajo, coordinación de horarios y bloques de tiempo ajustables"
            : "Workforce planning, shift coordination, and custom time blocks." 
          }
        </h2>
        <Benefits />
        
        <h2>
          {
            lang === "es" 
            ? "Sólo en 🖐🏾 pasos"
            : "Just in 🖐🏾 steps" 
          }
        </h2>

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
        
        
        <div className="w-[364px] h-auto rounded-xl overflow-hidden shadow-xl/30">
          <video autoPlay={true} loop muted playsInline preload="metadata" className="w-full object-[53%_100%] object-cover aspect-[5/11.5] ">
            <source src="/assets/generate.mp4" type="video/mp4" />
            Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
          </video>
        </div>

        <h3></h3>
        <video autoPlay={true} loop muted playsInline preload="metadata" className="max-w-[732px] w-full rounded-xl shadow-xl/30">
          <source src="/assets/result.mp4" type="video/mp4" />
          Seems like this mp4 video cannot be played. Retry by refreshing the page, using another browser or using a more stable internet connection.
        </video>
      </div>
      
      <footer className="text-[#27272a] dark:text-[#f4f4f5] dark:bg-[#27272A] flex flex-col justify-start items-start gap-2 w-full h-fit bg-[#F4F4F5] bottom-0 p-10 pb-20 sm:grid sm:grid-cols-[auto_3px_auto]">
          <ul className="m-3 sm:col-start-1">
            <li id="legal-1" className="flex flex-row gap-3 justify-start items-start mb-2"><span className="text-tiny">1</span>{ lang === "es" ? <span className="text-tiny"><b>Claude</b> <ClaudeTiny /> es un modelo de inteligencia artificial perteneciente a la empresa Anthropic PBC ©. Su nombre, ícono, así como el logo <AnthropicTiny/> usados en esta aplicación web, son propiedad de <Link href="https://www.anthropic.com/">Anthropic PBC ©</Link>.</span> : <span className="text-tiny"><b>Claude</b> <ClaudeTiny/> is an Artificial Intelligence model property of Anthropic PBC ©. Its name and icon, as well as <AnthropicTiny/> logo used in this web application are property of <Link href="https://www.anthropic.com/">Anthropic PBC ©</Link>.</span> }</li>
            <li id="legal-2" className="flex flex-row gap-3 justify-start items-start mb-2"><span className="text-tiny">2</span>{ lang === "es" ? <span className="text-tiny">La opción de uso de Inteligencia Artificial es habilitado con el modelo Claude 4 Opus de la empresa Anthropic. Al usar esta opción estarás de acuerdo con sus <Link href="https://www.anthropic.com/legal/consumer-terms">Términos de Uso</Link>. Aunque continuamente buscamos nuevas formas para mejorar el resultado de la IA desde nuestra aplicación, no garantizamos la precisión, fiabilidad o eficacia de la respuesta generada por la Inteligencia Artificial.</span> : <span className="text-tiny">The Artificial Intelligence feature is provided by Anthropic through Claude 4 Opus AI Model. By using this feature you agree with their <Link href="https://www.anthropic.com/legal/consumer-terms">Terms of Service</Link>. Even though we continuously look for better ways to improve the AI's output from our end, we do not guarantee the accuracy, reliability, or effectiveness of the AI generated output.</span> }</li>
            <li id="legal-3" className="flex flex-row gap-3 justify-start items-start mb-2"><span className="text-tiny">3</span>{ lang === "es" ? <span className="text-tiny">Cada usuario tiene un límite máximo de tres tablas para crear. Sin embargo, cualquier tabla puede ser guardada, editada y eliminada por el usuario en cualquier momento.</span> : <span className="text-tiny">There is a creation limit of three tables maximum per User. However, all tables can be saved, modified and deleted at any time.</span> }</li>
            <li id="legal-4" className="flex flex-row gap-3 justify-start items-start mb-2"><span className="text-tiny">4</span>{ lang === "es" ? <span className="text-tiny">Es responsabilidad del usuario leer nuestros <Link href={`${lang}/terms`}>Términos de Uso</Link> y nuestro <Link href={`${lang}/privacy`}>Aviso de Privacidad</Link> antes de registrase y hacer uso de esta plataforma. Al registrarte y utilizar esta aplicación web, aceptas nuestros Términos de Uso y Aviso de Privacidad.</span> : <span className="text-tiny">It is the User's responsability to read our <Link href={`${lang}/terms`}>Terms of Use</Link> and our <Link href={`${lang}/privacy`}>Privacy Policy</Link> before signing up and using this platform. By accessing, registering, and using this web application, you accept our Terms of Use and Privacy Policy completely.</span> }</li>
          </ul>
          <Divider orientation="vertical" className="hidden sm:block sm:col-start-2" />
          <ul className="m-3 text-center self-center sm:text-left sm:col-start-3">
            <li><Link href={`${lang}/contact`}>{ lang === "es" ? "Contacto" : "Contact" }</Link></li>
            <li><Link href={`${lang}/privacy`}>{ lang === "es" ? "Privacidad" : "Privacy" }</Link></li>
            <li><Link href={`${lang}/terms`}>{ lang === "es" ? "Términos de Uso" : "Terms of Use" }</Link></li>
            <li><Link href={`${lang}/delete-my-data`}>{ lang === "es" ? "Eliminar mi Información" : "Delete My Data" }</Link></li>
            <li className="mt-2">{ lang === "es" ? "Hecho con ❤️ en México" : "Made with ❤️ in Mexico" }</li>
          </ul>
      </footer>
    </main>
  );
}

function ColorStrains ({ width = 500, height = 250 }: { width: number | string, height?: number | string }) {
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg"
    width={ width } 
    height={ height } 
    viewBox="0 0 132.28996 37.576861" 
    version="1.1" 
    id="color-strains">
      <defs id="defs1"/>
      <g id="layer1" transform="translate(-0.00332998,-14.822098)">
        <path 
        style={{
          display: "inline",
          fill: "#0072f5",
          fillOpacity:1,
          stroke: "none",
          strokeWidth: 1.102,
          strokeDasharray: "none",
          strokeOpacity: 1
        }} 
        d="m 0.00801943,52.273089 c 0,0 22.77341857,-19.298843 67.37168857,-20.584368 48.995122,-1.412264 64.913592,-12.199445 64.913592,-12.199445 0,0 -5.21887,12.818033 -29.59829,14.250785 C 63.815253,36.024982 39.798997,33.247379 0.00801943,52.273089 Z" 
        id="path5"/>
        <path 
        style={{
          display: "inline",
          fill: "#ff990a",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 1.10151,
          strokeDasharray: "none",
          strokeOpacity:1
        }} 
        d="m 0.01302618,52.278321 c 0,0 32.50491682,-32.876408 68.47507882,-21.586819 38.112025,11.961833 63.804085,-11.24652 63.804085,-11.24652 0,0 -0.29231,11.0575 -31.75944,17.654928 C 75.985325,42.246545 48.462982,16.300527 0.01302618,52.278321 Z" 
        id="path3"/>
        <path 
        style={{
          fill: "#8a2be2",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 1.10151,
          strokeDasharray: "none",
          strokeOpacity: 1
        }} 
        d="m 0.00332998,52.268463 c 0,0 39.05022402,2.947037 69.58239202,-19.168433 C 104.79423,7.5973264 132.2875,19.490415 132.2875,19.490415 c 0,0 -8.0333,-3.852241 -20.56793,-4.556764 -6.07683,-0.341555 -13.174467,0.04512 -20.854439,1.946416 C 67.79965,22.590268 49.916775,52.268811 0.00332998,52.268463 Z" 
        id="path4"/>
      </g>
    </svg>
  )
}