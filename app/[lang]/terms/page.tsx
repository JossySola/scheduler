import { Code, Divider } from "@heroui/react";
import Link from "next/link";

export default async function Page ({ params }: {
    params: Promise<{ lang: "es" | "en"}>
}) {
    const lang = (await params).lang;

    if (lang === "es") {
        return (
            <section className="p-10 pb-[6rem] text-base/7 h-fit">

                <h1>Términos de Uso</h1>

                <i>Fecha de entrada en vigor: 8 de abril de 2025.</i>
                <Divider className="my-4" />
                <h2>1. Aceptación de los Términos</h2>
                
                <p>Al acceder y utilizar Scheduler ("la aplicación web"), aceptas cumplir con estos Términos de Uso. Si no estás de acuerdo, no podrás utilizar el servicio.</p>
            
                <h2>2. Registro de Cuenta y Seguridad</h2>

                <ul className="pl-8 list-disc">
                    <li>Debes proporcionar información precisa y completa al registrarte.</li>
                    <li>Eres responsable de mantener la confidencialidad de tus credenciales de acceso.</li>
                    <li>No debes compartir tu cuenta con otras personas ni utilizar la cuenta de otro usuario.</li>
                </ul>

                <h2>3. Política de Contraseñas</h2>
                
                <ul className="pl-8 list-disc">
                    <li>Tu contraseña debe tener al menos 8 caracteres.</li>
                    <li>Se recomienda encarecidamente usar la sugerencia del Gestor de Contraseñas, ya que ofrece contraseñas altamente seguras.</li>
                    <li>Todas las contraseñas se verifican contra una <Code size="sm">base de datos pública de contraseñas expuestas <a href="#footer"><sup>1</sup></a></Code> por seguridad, se cifran usando <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> y se encriptan antes de ser almacenadas.</li>
                </ul>

                <h2>4. Contenido Generado por el Usuario (Horarios y Tablas)</h2>
                
                <ul className="pl-8 list-disc">
                    <li>Conservas la propiedad de los horarios y tablas que crees.</li>
                    <li>Todos los horarios y tablas se encriptan <a href="#footer"><sup>3</sup></a> utilizando algoritmos de cifrado robustos antes de su almacenamiento.</li>
                    <li>Puedes eliminar tus horarios en cualquier momento.</li>
                </ul>
                
                <h2>5. Eliminación de Cuenta y Eliminación de Datos</h2>
                
                <ul className="pl-8 list-disc">
                    <li>Puedes eliminar tu cuenta en cualquier momento, lo que borrará todos los datos vinculados y desconectará cualquier proveedor asociado.</li>
                    <li>Puedes desconectar tu cuenta de Google o Facebook sin necesidad de eliminar tu cuenta.</li>
                </ul>
                
                <h2>6. Uso de Inteligencia Artificial</h2>

                <ul className="pl-8 list-disc">
                    <li>Nuestra aplicación web ofrece asistencia en la creación de horarios mediante <Code size="sm">inteligencia artificial <a href="#footer"><sup>4</sup></a></Code> a través de un servicio externo.</li>
                    <li>No garantizamos la precisión, fiabilidad o eficacia de los horarios generados por IA.</li>
                    <li>Al utilizar la función de generación de IA, aceptas sus <Link href="https://www.anthropic.com/legal/consumer-terms">Términos y Condiciones</Link>.</li>
                </ul>

                <h2>7. Actividades Prohibidas</h2>
                
                <p>Al utilizar nuestra aplicación web, aceptas NO realizar lo siguiente:</p>
                
                <ul className="pl-8 list-disc">
                    <li>Usar el servicio para actividades ilegales, fraudulentas o perjudiciales.</li>
                    <li>Intentar acceder sin autorización a otras cuentas y/o datos confidenciales.</li>
                    <li>Interferir con la funcionalidad de la plataforma (por ejemplo, hackeo o explotación de vulnerabilidades).</li>
                </ul>
                
                <h2>8. Limitación de Responsabilidad</h2>
                
                <p>Ofrecemos esta aplicación web "tal como está". Aunque tomamos la seguridad en serio, no nos responsabilizamos por:</p>
                
                <ul className="pl-8 list-disc">
                    <li>Cualquier pérdida de datos debido a fallos inesperados del sistema.</li>
                    <li>Accesos no autorizados causados por contraseñas débiles o negligencia del usuario.</li>
                    <li>Inexactitudes en los horarios generados por IA.</li>
                </ul>

                <h2>9. Terminación del Acceso</h2>
                
                <p>Nos reservamos el derecho de suspender o cancelar el acceso a tu cuenta si violas estos términos.</p>
                

                <h2>10. Actualizaciones de estos Términos</h2>

                <p>Podemos actualizar estos Términos de Uso en cualquier momento. Si se producen cambios significativos, notificaremos a los usuarios por correo electrónico o mediante una notificación en la aplicación.</p>

                <h2>11. Información de Contacto</h2>
                
                <p>Si tienes preguntas o inquietudes sobre estos términos, contáctanos {<Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`}>aquí</Link>}.</p>
                <Divider className="my-4"/>
                <footer className="text-tiny dark:bg-[#1A1A1A]" id="footer">
                    <p className="mb-1">1 <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> es un servicio que proporciona una lista de contraseñas que han sido expuestas previamente en filtraciones de datos. Esto se utiliza para evitar el uso de contraseñas inseguras. Desde nuestro lado, verificamos tu contraseña usando un método que preserva la privacidad y asegura que nunca se revele por completo.</p>
                    <p className="mb-1">2 <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> es una versión híbrida de <b>Argon2</b>, que es una función de derivación de claves usada para cifrar contraseñas.</p>
                    <p className="mb-1">3 Los datos sensibles se encriptan antes de almacenarse en nuestra base de datos usando un algoritmo de cifrado robusto y claves gestionadas de forma segura.</p>
                    <p className="mb-1">4 <Link href="https://www.anthropic.com/legal/privacy">Política de Privacidad de Anthropic.</Link> Para las funciones relacionadas con IA, usamos un modelo de lenguaje compatible con la privacidad proporcionado por Anthropic.</p>
                </footer>
            </section>
        )
    }
    return (
        <section className="p-10 pb-[6rem] text-base/7 h-fit">

            <h1>Terms of Use</h1>

            <i>Effective Date: April 8th, 2025.</i>
            <Divider className="my-4" />
            <h2>1. Acceptance of Terms</h2>
            
            <p>By accessing and using Scheduler ("the web app"), you agree to comply with these Terms of Use. If you do not agree, you may not use the service.</p>
           
            <h2>2. Account Registration & Security</h2>

            <ul className="pl-8 list-disc">
                <li>You must provide accurate and complete information when registering.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You must not share your account with others or use another user’s account.</li>
            </ul>

            <h2>3. Password Policy</h2>
            
            <ul className="pl-8 list-disc">
                <li>Your password must be at least 8 characters long.</li>
                <li>It is highly recommended to use the Password Manager’s suggestion, as it is able to offer the strongest password suggestions.</li>
                <li>All passwords are checked against a public <Code size="sm">database of exposed passwords <a href="#footer"><sup>1</sup></a></Code> for security, hashed using <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> and encrypted before storage.</li>
            </ul>

            <h2>4. User-Generated Content (Schedules & Tables)</h2>
            
            <ul className="pl-8 list-disc">
                <li>You retain ownership of the schedules and tables you create.</li>
                <li>All schedules and tables are encrypted <a href="#footer"><sup>3</sup></a> using strong encryption algorithms before storage.</li>
                <li>You may delete your schedules at any time.</li>
            </ul>
            
            <h2>5. Account Deletion & Data Removal</h2>
            
            <ul className="pl-8 list-disc">
                <li>You may delete your account at any time, which will erase all linked data and disconnect any linked providers.</li>
                <li>You may disconnect your account from Google or Facebook without deleting your account.</li>
            </ul>
            
            <h2>6. Use of Artificial Intelligence</h2>

            <ul className="pl-8 list-disc">
                <li>Our web app provides <Code size="sm">AI-generated <a href="#footer"><sup>4</sup></a></Code> scheduling assistance through an external service.</li>
                <li>We do not guarantee the accuracy, reliability, or effectiveness of AI-generated schedules.</li>
                <li>By using the "Generate" AI feature, you agree to their <Link href="https://www.anthropic.com/legal/consumer-terms">Terms & Conditions</Link>.</li>
            </ul>

            <h2>7. Prohibited Activities</h2>
            
            <p>When using our web app, you agree NOT to:</p>
            
            <ul className="pl-8 list-disc">
                <li>Use the service for illegal, fraudulent, or harmful activities.</li>
                <li>Attempt to gain unauthorized access to other accounts and/or confidential data.</li>
                <li>Interfere with the platform’s functionality (e.g., hacking, exploiting vulnerabilities).</li>
            </ul>
            
            <h2>8. Limitation of Liability</h2>
            
            <p>We provide this web app on an "as-is" basis. While we take security seriously, we are not responsible for:</p>
            
            <ul className="pl-8 list-disc">
                <li>Any data loss due to unexpected system failures.</li>
                <li>Unauthorized access caused by weak user passwords or user negligence.</li>
                <li>AI-generated scheduling inaccuracies.</li>
            </ul>

            <h2>9. Termination of Access</h2>
            
            <p>We reserve the right to terminate or suspend access to your account if you violate these terms.</p>
            

            <h2>10. Updates to These Terms</h2>

            <p>We may update these Terms of Use at any time. If significant changes occur, we will notify users via email or an in-app notification.</p>

            <h2>11. Contact Information</h2>
            
            <p>If you have any questions or concerns about these terms, please contact us {<Link href={`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/contact`}>here</Link>}.</p>
            <Divider className="my-4"/>
            <footer className="text-tiny dark:bg-[#1A1A1A]" id="footer">
                <p className="mb-1">1 <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> is a service that provides a list of passwords previously exposed in data breaches. This is used to avoid the use of unsuitable passwords. From our side, we check your password against a public database of exposed passwords (Have I Been Pwned) using a privacy-preserving method that ensures your password is never fully revealed.</p>
                <p className="mb-1">2 <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> is a hybrid version of <b>Argon2</b>, which is a key derivation function used to hash passwords.</p>
                <p className="mb-1">3 Sensitive data is encrypted before being stored in our database using a strong encryption algorithm and securely managed keys.</p>
                <p className="mb-1">4 <Link href="https://www.anthropic.com/legal/privacy">Anthropic Privacy Policy.</Link> For AI-related features, we use a privacy-compliant language model provided by Anthropic.</p>
            </footer>
        </section>
    )
}