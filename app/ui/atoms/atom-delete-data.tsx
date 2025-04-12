"use client"
import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import { LogoFacebook, LogoGoogle, SettingsGearFill } from "geist-icons";
import { useParams } from "next/navigation"

export default function DeleteDataList() {
    const params = useParams();
    const lang = params.lang ?? "en";

    return <Accordion variant="shadow">
        <AccordionItem title={ lang === "es" ? "Eliminar mi cuenta" : "Delete my account" } className="p-3">
            <p>{ lang === "es" ? "Esta acción es permanente e irreversible. Eliminar tu cuenta borrará tus datos personales de la base de datos, así como las tablas que hayas creado, y conexiones con Google y Facebook." : 
            "This action is permanent and irreversible. Deleting your account will erase all your personal data from the database, as well as all schedules made by you and release any connection with Google and/or Facebook."}</p>
            <ol className="list-decimal w-full ml-5">
                <li>
                    <h3>{ lang === "es" ? "En tu panel, ve a 'Ajustes' haciendo click en el ícono de engrane que está a lado de tu nombre de usuario" : "On your dashboard, go to 'Settings' by clicking on the gear icon next to your username" }</h3>
                    <Card className="w-fit bg-[#3f3f46]">
                        <CardBody>
                            <SettingsGearFill />
                        </CardBody>
                    </Card>
                </li>
                <li>
                    <h3>{ lang === "es" ? "Haz click en 'Eliminar cuenta'" : "Click on 'Delete account'" }</h3>
                    <Card className="w-fit bg-[#f31260] text-white">
                        <CardBody>
                            { lang === "es" ? "Eliminar cuenta" : "Delete account" }
                        </CardBody>
                    </Card>
                </li>
                <li>
                    <h3>{ lang === "es" ? "Confirma esta acción escribiendo tu contraseña y haciendo click en el botón 'Confirmar'" : "Confirm this action by writing your password and clicking 'Confirm'" }</h3>
                    <Card className="w-[100px] bg-black dark:bg-white text-white dark:text-black">
                        <CardBody className="flex flex-row items-center justify-center">
                            { lang === "es" ? "Confirmar" : "Confirm" }
                        </CardBody>
                    </Card>
                </li>
            </ol>
        </AccordionItem>
        <AccordionItem title={ lang === "es" ? "Desconectar de Google" : "Disconnect from Google" } className="p-3">
            <p>{ lang === "es" ? "Puedes conectar y desconectar tu cuenta de Google en cualquier momento. Sin embargo, si ésta es tu única forma de iniciar sesión, esta acción podría impedirte acceder a tu cuenta una vez realizada." : 
            "You can connect and disconnect your account from Google at any time. However, if you signin through Google but do not have another method for signing in, disconnecting from Google may prevent you from accessing your account."}</p>
            <br></br>
            <b className="text-[#f31260]">{lang === "es" ? "Esta acción no elimina tus datos ni tu cuenta." : "This action does not delete your data or your account." }</b>
            <ol className="list-decimal w-full ml-5">
            <li>
                    <h3>{ lang === "es" ? "En tu panel, ve a 'Ajustes' haciendo click en el ícono de engrane que está a lado de tu nombre de usuario" : "On your dashboard, go to 'Settings' by clicking on the gear icon next to your username" }</h3>
                    <Card className="w-fit bg-[#3f3f46]">
                        <CardBody>
                            <SettingsGearFill />
                        </CardBody>
                    </Card>
                </li>
                <li>
                    <h3>{ lang === "es" ? "Haz click en 'Desconectar Google'" : "Click on 'Disconnect from Google'" }</h3>
                    <Card className="w-fit bg-white text-black border-1 border-black">
                        <CardBody className="flex flex-row gap-3">
                            { lang === "es" ? "Desconectar Google" : "Disconnect from Google" }
                            <LogoGoogle />
                        </CardBody>
                    </Card>
                </li>
                <li>
                    <h3>{ lang === "es" ? "Confirma esta acción haciendo click en el botón 'Confirmar'" : "Confirm this action by clicking 'Confirm'" }</h3>
                    <Card className="w-[100px] bg-black dark:bg-white text-white dark:text-black">
                        <CardBody className="flex flex-row items-center justify-center">
                            { lang === "es" ? "Confirmar" : "Confirm" }
                        </CardBody>
                    </Card>
                </li>
            </ol>
            <br></br>
            <i>{lang === "es" ? "Es posible que como paso adicional, tengas que desvincular tu cuenta desde tus ajustes de Google." : "Additionally you may need to take some steps in your Google account to disconnect this Web Application." }</i>
        </AccordionItem>
        <AccordionItem title={ lang === "es" ? "Desconectar de Facebook" : "Disconnect from Facebook" } className="p-3">
        <p>{ lang === "es" ? "Puedes conectar y desconectar tu cuenta de Facebook en cualquier momento. Sin embargo, si ésta es tu única forma de iniciar sesión, esta acción podría impedirte acceder a tu cuenta una vez realizada." : 
            "You can connect and disconnect your account from Facebook at any time. However, if you signin through Facebook but do not have another method for signing in, disconnecting from Facebook may prevent you from accessing your account."}</p>
            <br></br>
            <b className="text-[#f31260]">{lang === "es" ? "Esta acción no elimina tus datos ni tu cuenta." : "This action does not delete your data or your account." }</b>
            <ol className="list-decimal w-full ml-5">
                <li>
                    <h3>{ lang === "es" ? "En tu panel, ve a 'Ajustes' haciendo click en el ícono de engrane que está a lado de tu nombre de usuario" : "On your dashboard, go to 'Settings' by clicking on the gear icon next to your username" }</h3>
                    <Card className="w-fit bg-[#3f3f46]">
                        <CardBody>
                            <SettingsGearFill />
                        </CardBody>
                    </Card>
                </li>
                <li>
                    <h3>{ lang === "es" ? "Haz click en 'Desconectar Facebook'" : "Click on 'Disconnect from Facebook'" }</h3>
                    <Card className="w-fit bg-white text-black border-1 border-black">
                        <CardBody className="flex flex-row gap-3">
                            { lang === "es" ? "Desconectar Facebook" : "Disconnect from Facebook" }
                            <LogoFacebook color="#0866ff"/>
                        </CardBody>
                    </Card>
                </li>
                <li>
                    <h3>{ lang === "es" ? "Confirma esta acción haciendo click en el botón 'Confirmar'" : "Confirm this action by clicking 'Confirm'" }</h3>
                    <Card className="w-[100px] bg-black dark:bg-white text-white dark:text-black">
                        <CardBody className="flex flex-row items-center justify-center">
                            { lang === "es" ? "Confirmar" : "Confirm" }
                        </CardBody>
                    </Card>
                </li>
            </ol>
            <br></br>
            <i>{lang === "es" ? "Es posible que como paso adicional, tengas que desvincular tu cuenta desde tus ajustes de Facebook." : "Additionally you may need to take some steps in your Facebook account to disconnect this Web Application." }</i>
        </AccordionItem>
    </Accordion>
}