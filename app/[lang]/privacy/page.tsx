import { Code, Divider } from "@heroui/react";
import Link from "next/link";

export default async function Page ({ params }: {
    params: Promise<{ lang: "es" | "en" }>
}) {
    const lang = (await params).lang;

    if (lang === "es") {
        return (
            <section className="p-10 pb-[6rem] text-base/7 h-fit">
                <h1>Política de Privacidad</h1>

                <i>Fecha de entrada en vigor: 15 de julio de 2025.</i>
                <Divider className="my-4"/>
                <h2>1. Introducción</h2>

                <p>Bienvenido a Scheduler ("nosotros"). Tu privacidad es importante para nosotros y estamos comprometidos a proteger tus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tu información cuando utilizas nuestra aplicación web.</p>

                <h2>2. Datos que Recopilamos</h2>

                <p>Cuando te registras y utilizas nuestra aplicación web, recopilamos los siguientes datos personales:</p>

                <ul className="pl-4 list-disc">
                    <li><b>Datos obligatorios:</b> Nombre, nombre de usuario, fecha de nacimiento, correo electrónico y contraseña. <i>Si inicias sesión con un proveedor, ya sea Google o Facebook, no se requieren los siguientes datos: nombre de usuario, fecha de nacimiento, contraseña.</i></li>
                    <li><b>Datos opcionales:</b> Foto de perfil (solo si inicias sesión a través de Google o Facebook, y hay una foto de perfil disponible).</li>
                    <li><b>Datos generados por el usuario:</b> Horarios y tablas que creas y guardas.</li>
                </ul>

                <h2>3. Cómo Protegemos tus Datos</h2>

                <p>Implementamos medidas de seguridad estrictas para asegurar que tus datos permanezcan protegidos:</p>

                <ul className="pl-4 list-disc">
                    <li>
                        <h3>Seguridad de la Contraseña:</h3>
                        <ul className="pl-8 list-disc">
                            <li>Debe tener al menos 8 caracteres.</li>
                            <li>Se recomienda usar la contraseña sugerida por un gestor de contraseñas.</li>
                            <li>Se verifica contra una <Code size="sm">base de datos pública de contraseñas expuestas <a href="#footer"><sup>1</sup></a></Code> para asegurar que no ha sido comprometida en filtraciones de datos.</li>
                            <li>Se cifra mediante <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> antes de almacenarse (nunca guardamos contraseñas en texto plano).</li>
                            <li>Como segunda capa de seguridad, la contraseña cifrada se encripta antes de almacenarse en la base de datos con una clave de cifrado <b>ÚNICA</b> <a href="#footer"><sup>3</sup></a>.</li>
                        </ul>
                    </li>
                    <li>
                        <h3>Encriptación de los Horarios:</h3>
                        <ul className="pl-8 list-disc">
                            <li>Todos los horarios se encriptan <a href="#footer"><sup>4</sup></a> completamente usando algoritmos de cifrado robustos antes de ser almacenados.</li>
                        </ul>
                    </li>
                    <li>
                        <h3>Datos recopilados de proveedores externos (Google/Facebook):</h3>
                        <ul className="pl-8 list-disc">
                            <li>Nombre</li>
                            <li>Correo electrónico principal</li>
                            <li>Foto de perfil del usuario (si está disponible)</li>
                        </ul>
                        <br/>
                        El propósito de esta recopilación es personalizar la experiencia del usuario dentro de la aplicación web y almacenar un registro para guardar posteriormente sus horarios creados.
                    </li>
                </ul>

                <h2>4. Cómo Usamos tus Datos</h2>
                
                <p>Usamos tus datos únicamente con el fin de proporcionar y mejorar nuestra aplicación web. Específicamente, los usamos para:</p>
                
                <ul className="pl-4 list-disc">
                    <li>Autenticar tu acceso a la plataforma.</li>
                    <li>Habilitar la creación de horarios asistida por IA con base en tus entradas.</li>
                    <li>Mejorar la seguridad y prevenir fraudes.</li>
                    <li>Permitir la gestión de cuenta, incluyendo cambios de contraseña y conexión con proveedores externos (Google/Facebook).</li>
                </ul>
                
                <h2>5. Servicios de Terceros</h2>
                
                <p>Integramos servicios externos para mejorar nuestra plataforma:</p>

                <ul className="pl-4 list-disc">
                    <li><b>Proveedores de autenticación:</b> Google y Facebook para opciones de inicio de sesión.</li>
                    <li><b>Servicio de Inteligencia Artificial (Anthropic):</b> Un sistema de IA externo que asiste en la generación de horarios estratégicos.</li>
                </ul>

                <i>Estos servicios de terceros pueden recopilar datos según sus propias políticas de privacidad. Te recomendamos revisar sus términos antes de conectar tu cuenta <a href="#footer"><sup>5</sup></a>.</i>

                <h2>6. Control del Usuario y Eliminación de Cuenta</h2>

                <ul className="pl-4 list-disc">
                    <li>
                        <b>Eliminación de cuenta:</b> Puedes eliminar tu cuenta en cualquier momento. Esto:
                        <ul className="pl-8 list-disc">
                            <li>Eliminará todos tus datos personales (nombre, usuario, fecha de nacimiento, correo, contraseña).</li>
                            <li>Borrará todos los horarios y tablas almacenadas.</li>
                            <li>Desconectará cualquier proveedor vinculado (Google y/o Facebook).</li>
                        </ul>
                        <i>Para más información, visita: <a href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/delete-my-data`} target="_blank">Eliminar mis datos</a></i>
                    </li>
                    <li><b>Desconectar proveedores:</b> Puedes desconectar manualmente tu cuenta de Google o Facebook sin eliminar tu cuenta.</li>
                    <li><b>Cambio de contraseña:</b> Puedes cambiar tu contraseña en cualquier momento.</li>
                    <li><b>Creación de tablas:</b> Puedes crear, modificar, guardar y eliminar las tablas que te pertenecen en la plataforma en cualquier momento.</li>
                </ul>

                <h2>7. Retención de Datos</h2>

                <p>Almacenamos tus datos solo mientras tu cuenta esté activa. Si eliminas tu cuenta, todos tus datos personales se eliminan permanentemente.</p>

                <h2>8. Privacidad de los Menores</h2>
                
                <p>Nuestra aplicación web no está dirigida a menores de 13 años. Si nos damos cuenta de que un niño menor de 13 ha proporcionado datos personales, tomaremos medidas inmediatas para eliminarlos.</p>

                <h2>9. Cookies</h2>

                <p>Solo utilizamos <Code size="sm">Cookies <a href="#footer"><sup>6</sup></a></Code> para la gestión de autenticación del usuario.</p>

                <h2>10. Roles de Usuario en la Plataforma</h2>

                <p>Todos los usuarios en la base de datos tienen los mismos privilegios y opciones. Esto significa que no hay superusuarios ni roles con privilegios especiales que puedan ver o modificar tus datos.</p>
                
                <h2>11. Actualizaciones de Esta Política</h2>

                <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Si realizamos cambios importantes, te lo notificaremos por correo electrónico o dentro de la aplicación web.</p>

                <h2>12. Compartición de Datos con Autoridades Legales</h2>
                Los datos podrán ser compartidos únicamente si la solicitud proviene de una autoridad legal competente. En ese caso, se seguirá el siguiente proceso:
                <ul className="pl-4 list-disc">
                    <li><b>Política de legitimidad:</b> Se realizará una revisión de la legalidad de la solicitud recibida.</li>
                    <li><b>Política de minimización:</b> Solo se compartirá la información mínima y estrictamente necesaria.</li>
                    <li><b>Documentación del proceso:</b> Se documentará la solicitud, incluyendo las respuestas dadas, la justificación legal y los actores involucrados.</li>
                </ul>

                <h2>13. Contáctanos</h2>

                <p>Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos {<Link href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/contact`}>aquí</Link>}.</p>
                <Divider className="my-4"/>
                <footer className="text-tiny dark:bg-[#1A1A1A]" id="footer">
                    <p className="mb-1">1 <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> es un servicio que proporciona una lista de contraseñas que han sido expuestas previamente en filtraciones de datos. Esto se utiliza para evitar el uso de contraseñas poco seguras. Desde nuestro lado, verificamos tu contraseña usando un método que preserva la privacidad y asegura que tu contraseña nunca sea revelada.</p>
                    <p className="mb-1">2 <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> es una versión híbrida de <b>Argon2</b>. Ciframos todas las contraseñas usando Argon2id, un algoritmo de cifrado recomendado por expertos en seguridad.</p>
                    <p className="mb-1">3 <Link href="https://docs.aws.amazon.com/kms/latest/developerguide/overview.html">AWS KMS</Link> es el <b>Servicio de Gestión de Claves</b> proporcionado por <b>Amazon Web Services</b>. Usamos la infraestructura segura de AWS para encriptar datos sensibles.</p>
                    <p className="mb-1">4 Los datos sensibles se encriptan antes de almacenarse en nuestra base de datos usando un algoritmo fuerte y claves de cifrado gestionadas de forma segura.</p>
                    <p className="mb-1">5 <Link href="https://www.anthropic.com/legal/privacy">Política de Privacidad de Anthropic.</Link> Para las funciones basadas en IA, usamos un modelo de lenguaje compatible con la privacidad proporcionado por Anthropic.</p>
                    <p className="mb-1">6 <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies">Cookies</Link> son pequeños fragmentos de datos que un servidor envía al navegador del usuario para preservar y gestionar la información entre cliente y servidor. En este caso, usamos Cookies para mantener y gestionar la autenticación y sesión del usuario mientras utiliza la aplicación, si ha iniciado sesión.</p>
                </footer>
            </section>
        )
    }
    return (
        <section className="p-10 pb-[6rem] text-base/7 h-fit">
            
            <h1>Privacy Policy</h1>

            <i>Effective Date: July 15th, 2025.</i>
            <Divider className="my-4"/>
            <h2>1. Introduction</h2>

            <p>Welcome to Scheduler ("we," "our," or "us"). Your privacy is important to us, and we are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our web application.</p>

            <h2>2. Data We Collect</h2>

            <p>When you register and use our web app, we collect the following personal data:</p>

            <ul className="pl-4 list-disc">
                <li><b>Mandatory Data:</b> Name, username, birthday, email, and password. <i>In case you sign in with a provider, either Google or Facebook, the following data is not required: username, birthday, password.</i></li>
                <li><b>Optional Data:</b> Profile picture (only if you sign in via Google or Facebook, and a profile picture is available).</li>
                <li><b>User-generated Data:</b> Schedules and tables you create and save.</li>
            </ul>

            <h2>3. How We Protect Your Data</h2>

            <p>We implement strict security measures to ensure your data remains secure:</p>

            <ul className="pl-4 list-disc">
                <li>
                    <h3>Password Security:</h3>
                    <ul className="pl-8 list-disc">
                        <li>Must be at least 8 characters long.</li>
                        <li>Recommended use of a Password Manager’s suggested password.</li>
                        <li>Checked against a public <Code size="sm">database of exposed passwords <a href="#footer"><sup>1</sup></a></Code> to verify it hasn’t been exposed in data breaches.</li>
                        <li>Hashed using <Code size="sm">Argon2id <a href="#footer"><sup>2</sup></a></Code> before storage (we never store raw passwords).</li>
                        <li>As a second security layer, the hashed password is encrypted before being stored in the database with a <b>UNIQUE</b> encryption key <a href="#footer"><sup>3</sup></a>.</li>
                    </ul>
                </li>
                <li>
                    <h3>Schedule Encryption:</h3>
                    <ul className="pl-8 list-disc">
                        <li>All schedules are encrypted <a href="#footer"><sup>4</sup></a> completely using strong encryption algorithms before storage.</li>
                    </ul>
                </li>
                <li>
                    <h3>Data collected from external providers (Google/Facebook):</h3>
                    <ul className="pl-8 list-disc">
                        <li>Name</li>
                        <li>Primary e-mail</li>
                        <li>User's profile picture (if available)</li>
                    </ul>
                    <br/>
                    The purpose of this data collection is to personalize the user's experience within the web application and store a record to subsequently store their created schedules.
                </li>
            </ul>

            <h2>4. How We Use Your Data</h2>
            
            <p>We use your data solely for the purpose of providing and improving our web app. Specifically, we use it to:</p>
            
            <ul className="pl-4 list-disc">
                <li>Authenticate your access to the platform.</li>
                <li>Enable AI-assisted scheduling based on user input.</li>
                <li>Improve security and prevent fraud.</li>
                <li>Allow account management, including password changes and third-party provider connections (Google/Facebook).</li>
            </ul>
            
            <h2>5. Third-Party Services</h2>
            
            <p>We integrate external services to enhance our platform:</p>

            <ul className="pl-4 list-disc">
                <li><b>Authentication Providers:</b> Google and Facebook for sign-in options.</li>
                <li><b>Artificial Intelligence Service (Anthropic):</b> An external AI system assists in generating strategic schedules.</li>
            </ul>

            <i>These third-party services may collect data as per their own privacy policies. We encourage you to review their terms before connecting your account <a href="#footer"><sup>5</sup></a>.</i>

            <h2>6. User Control & Account Deletion</h2>

            <ul className="pl-4 list-disc">
                <li>
                    <b>Account Deletion:</b> You may delete your account at any time. This will:
                    <ul className="pl-8 list-disc">
                        <li>Remove all personal data (name, username, birthday, email, password).</li>
                        <li>Erase all stored schedules and tables.</li>
                        <li>Disconnect any linked providers (Google and/or Facebook).</li>
                    </ul>
                    <i>For more information, visit: <a href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/delete-my-data`} target="_blank">Delete My Data</a></i>
                </li>
                <li><b>Disconnecting Providers:</b> You can manually disconnect your account from Google or Facebook without deleting your account.</li>
                <li><b>Password Change:</b> You can change your password at any time.</li>
                <li><b>Table creation:</b> You can create, modify, save and delete the tables you own in the platform at any time.</li>
            </ul>

            <h2>7. Data Retention</h2>

            <p>We store your data only as long as your account is active. If you delete your account, all personal data is permanently erased.</p>

            <h2>8. Children's Privacy</h2>
            
            <p>Our web app is not intended for individuals under the age of 13. If we become aware that a child under 13 has provided personal data, we will take immediate steps to delete the information.</p>

            <h2>9. Cookies</h2>

            <p>We only use <Code size="sm">Cookies <a href="#footer"><sup>6</sup></a></Code> for User's Authentication management.</p>

            <h2>10. User roles in the platform</h2>

            <p>All users in the database have the same privileges and options. This means there are no super-users or roles with special privileges within the platform that may be able to view and modify any of your data.</p>
            
            <h2>11. Updates to This Policy</h2>

            <p>We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email or within the web app.</p>

            <h2>12. Data Provision</h2>
            We may provide your data to authorized entities under strict confidentiality. If this is the case, the process will be the following:
            <ul className="pl-4 list-disc">
                <li>Legitimacy policy. We will perform a review of the legality of the request.</li>
                <li>Data minimization policy. We will disclose the minimum information necessary.</li>
                <li>Documentation of the request, including the responses and the legal reasoning and actors involved.</li>
            </ul>

            <h2>13. Contact Us</h2>

            <p>If you have any questions about this Privacy Policy, please contact us {<Link href={`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/contact`}>here</Link>}.</p>
            <Divider className="my-4"/>
            <footer className="text-tiny dark:bg-[#1A1A1A]" id="footer">
                <p className="mb-1">1 <Link href="https://haveibeenpwned.com/Passwords">Have I Been Pwned</Link> is a service that provides a list of passwords previously exposed in data breaches. This is used to avoid the use of unsuitable passwords. From our side, we check your password against a public database of exposed passwords (Have I Been Pwned) using a privacy-preserving method that ensures your password is never fully revealed.</p>
                <p className="mb-1">2 <Link href="https://en.wikipedia.org/wiki/Argon2">Argon2id</Link> is a hybrid version of <b>Argon2</b>. We hash all passwords using Argon2id, a secure password hashing algorithm recommended by security experts.</p>
                <p className="mb-1">3 <Link href="https://docs.aws.amazon.com/kms/latest/developerguide/overview.html">AWS KMS</Link> is the <b>Key Management Service</b> provided by the <b>Amazon Web Services</b>. We use AWS’s secure key management infrastructure to encrypt sensitive data.</p>
                <p className="mb-1">4 Sensitive data is encrypted before being stored in our database using a strong encryption algorithm and securely managed keys.</p>
                <p className="mb-1">5 <Link href="https://www.anthropic.com/legal/privacy">Anthropic Privacy Policy.</Link> For AI-related features, we use a privacy-compliant language model provided by Anthropic.</p>
                <p className="mb-1">6 <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies">Cookies</Link> are small pieces of data a Server sends to the User's browser in order to preserve and manage information between the Client and the Server. In this case, we use Cookies to preserve and manage the User's authentication and session while using the application if they sign in.</p>
            </footer>
        </section>
    )
}