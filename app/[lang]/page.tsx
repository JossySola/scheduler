import { Divider } from "@heroui/react";
import Hero from "../ui/landing/atom-hero";
import Frames from "../ui/landing/landing-frames";
import Link from "next/link";

export const experimental_ppr = true;

export default async function App ({ params }: {
  params: Promise<{ lang: "en" | "es" }>,
}) {
  const lang = (await params).lang;

  return (
      <>
        <Hero lang={ lang } />
        <Frames lang={ lang } />
        <footer className="flex flex-col justify-start items-start gap-2 w-full h-fit bg-[#E4E4E7] bottom-0 p-10 pb-20 sm:grid sm:grid-cols-[auto_3px_auto]">
            <ul className="m-3 sm:col-start-1">
              <li className="flex flex-row gap-3 justify-start items-center"><sup id="legal-1">1</sup>{ lang === "es" ? <p className="text-tiny">La opción de uso de Inteligencia Artificial es dispuesta con el modelo Claude 3 Opus de la empresa Anthropic. Al usar esta opción estarás de acuerdo con sus <Link href="https://www.anthropic.com/legal/consumer-terms">Términos de Uso</Link>. No garantizamos la precisión, fiabilidad o eficacia de la respuesta generada por la Inteligencia Artificial.</p> : <p className="text-tiny">The Artificial Intelligence is provided by Anthropic, Claude 3 Opus Model. By using this feature you agree with their <Link href="https://www.anthropic.com/legal/consumer-terms">Terms of Service</Link>. We do not guarantee the accuracy, reliability, or effectiveness of the AI generated output.</p> }</li>
              <li className="flex flex-row gap-3 justify-start items-center"><sup id="legal-2">2</sup>{ lang === "es" ? <p className="text-tiny">Cada usuario tiene un límite máximo de tres tablas para crear. Sin embargo, cualquier tabla puede ser guardada, editada y eliminada por el usuario en cualquier momento.</p> : <p className="text-tiny">There is a creation limit of three tables maximum per User. However, all tables can be saved, modified and deleted at any time.</p> }</li>
              <li className="flex flex-row gap-3 justify-start items-center"><sup id="legal-3">3</sup>{ lang === "es" ? <p className="text-tiny">Es responsabilidad del usuario leer nuestros <Link href={`${lang}/terms`}>Términos de Uso</Link> y nuestro <Link href={`${lang}/privacy`}>Aviso de Privacidad</Link> antes de registrase y hacer uso de esta plataforma. Al registrarte y utilizar esta aplicación web, aceptas nuestros Términos de Uso y Aviso de Privacidad.</p> : <p className="text-tiny">It is the User's responsability to read our <Link href={`${lang}/terms`}>Terms of Use</Link> and our <Link href={`${lang}/privacy`}>Privacy Policy</Link> before signing up and using this platform. By accessing, registering, and using this web application, you accept our Terms of Use and Privacy Policy completely.</p> }</li>
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
      </>
  );
}
