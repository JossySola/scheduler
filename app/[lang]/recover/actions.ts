"use server"
import "server-only";
import pool from "@/app/lib/mocks/db";
import { randomUUID } from "crypto";
import sgMail from "@sendgrid/mail";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function SendResetEmailAction (formData: FormData) {
    const email = formData.get("email")?.toString();
    const requestHeaders = await headers();
    const lang = requestHeaders.get("x-user-locale") || "en";
    const responseUrl = new URL(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/recover`)

    if (!email) {
        responseUrl.searchParams.append("error", "400")
        redirect(responseUrl.toString());
    };

    const query = await pool.query(`
       SELECT EXISTS (
        SELECT 1 FROM scheduler_users WHERE email = $1
       );
    `, [email]);
    const userExists = query.rows[0].exists;

    if (!userExists) {
        responseUrl.searchParams.append("error", "404");
        redirect(responseUrl.toString());
    };

    const token = randomUUID();
    const resetUrl = new URL(`${process.env.NEXT_PUBLIC_ORIGIN}/${lang}/reset/q`);
    resetUrl.searchParams.append('email', email);
    resetUrl.searchParams.append('token', token);

    const messageES = {
        to: `${email}`,
        from: 'no-reply@jossysola.com',
        subject: 'Scheduler: Cambiar contraseña',
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <style type="text/css">
            body {width: 600px;margin: 0 auto;}
            table {border-collapse: collapse;}
            table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
            img {-ms-interpolation-mode: bicubic;}
            </style>
            <![endif]-->

            <style type="text/css">
            body, p, div {
                font-family: trebuchet ms,helvetica,sans-serif;
                font-size: 14px;
            }
            body {
                color: #313139;
            }
            body a {
                color: #1188E6;
                text-decoration: none;
            }
            p { margin: 0; padding: 0; }
            table.wrapper {
                width:100% !important;
                table-layout: fixed;
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: 100%;
                -moz-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            img.max-width {
                max-width: 100% !important;
            }
            .column.of-2 {
                width: 50%;
            }
            .column.of-3 {
                width: 33.333%;
            }
            .column.of-4 {
                width: 25%;
            }
            @media screen and (max-width:480px) {
                .preheader .rightColumnContent,
                .footer .rightColumnContent {
                    text-align: left !important;
                }
                .preheader .rightColumnContent div,
                .preheader .rightColumnContent span,
                .footer .rightColumnContent div,
                .footer .rightColumnContent span {
                text-align: left !important;
                }
                .preheader .rightColumnContent,
                .preheader .leftColumnContent {
                font-size: 80% !important;
                padding: 5px 0;
                }
                table.wrapper-mobile {
                width: 100% !important;
                table-layout: fixed;
                }
                img.max-width {
                height: auto !important;
                max-width: 480px !important;
                }
                a.bulletproof-button {
                display: block !important;
                width: auto !important;
                font-size: 80%;
                padding-left: 0 !important;
                padding-right: 0 !important;
                }
                .columns {
                width: 100% !important;
                }
                .column {
                display: block !important;
                width: 100% !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                }
            }
            </style>
            <!--user entered Head Start-->
            
            <!--End Head user entered-->
        </head>
        <body>
            <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: trebuchet ms,helvetica,sans-serif; color: #313139; background-color: #FFFFFF;">
            <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                <tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td>
                                <!--[if mso]>
                                <center>
                                <table><tr><td width="600">
                                <![endif]-->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                                    <tr>
                                    <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #313139; text-align: left;" bgcolor="#FFFFFF" width="100%" align="left">
                                        
            <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
            <tr>
                <td role="module-content">
                <p>Procede a cambiar tu contraseña</p>
                </td>
            </tr>
            </table>
        
            <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
                <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:40% !important;width:40%;height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="240"></a>
                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:20px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div>
        <h2 style="text-align: center;">Recuperaci&oacute;n de contrase&ntilde;a</h2>
        </div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:20px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div style="text-align: center;"><span style="font-size:18px;">Haz click en el siguiente bot&oacute;n para proceder a cambiar tu contrase&ntilde;a:</span></div>

                </td>
            </tr>
            </table>
        <table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#333333" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit"><a href="${resetUrl.toString()}" style="background-color:#333333;border:1px solid #333333;border-color:#333333;border-radius:6px;border-width:1px;color:#ffffff;display:inline-block;font-family:arial,helvetica,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none" target="_blank">Cambiar contraseña</a></td></tr></tbody></table></td></tr></tbody></table>
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div style="text-align: center;"><span style="color:#FF0000;"><em>&Eacute;ste enlace expirar&aacute; en 3 minutos.</em></span></div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div style="text-align: center;">
        <hr /></div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div>Si no solicitaste un Cambio de Contrase&ntilde;a, es posible que alguien m&aacute;s est&eacute; intentando tomar esta acci&oacute;n. Te recomendamos un cambio inmediato de la contrase&ntilde;a de tu correo electr&oacute;nico, para prevenir que la persona tambi&eacute;n intente acceder a la cuenta de tu correo electr&oacute;nico.</div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div>Recuerda que una contrase&ntilde;a segura siempre es la que incluye s&iacute;mbolos, n&uacute;meros, y letras min&uacute;sculas y may&uacute;sculas, en order aleatorio. Por tanto, recomendamos ampliamente el uso de <strong>Administradores de Contrase&ntilde;as</strong>, ya que ofrecen sugerencias de contrase&ntilde;as fuertes, almacenamiento de las mismas y forma en la que las puedas usar autom&aacute;ticamente sin necesidad de memorizarlas. Los <strong>Administradores de Contrase&ntilde;as</strong> son usualmente incluidas y listas para usarse en sistemas de proveedores como Apple, Microsoft, Google Chrome, etc.</div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div>Tambi&eacute;n es recomendable habilitar la <strong>Autenticaci&oacute;n Multifactor</strong> o la <strong>Verificaci&oacute;n en Dos Pasos</strong>, en las aplicaciones y servicios que lo ofrezcan, para a&ntilde;adir m&aacute;s seguridad a tus cuentas.</div>

                </td>
            </tr>
            </table>
        
                                    </td>
                                    </tr>
                                </table>
                                <!--[if mso]>
                                </td></tr></table>
                                </center>
                                <![endif]-->
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </div>
            </center>
        </body>
        </html>`
    }
    const messageEN = {
        to: `${email}`,
        from: 'no-reply@jossysola.com',
        subject: 'Scheduler: Reset Password',
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <style type="text/css">
            body {width: 600px;margin: 0 auto;}
            table {border-collapse: collapse;}
            table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
            img {-ms-interpolation-mode: bicubic;}
            </style>
            <![endif]-->

            <style type="text/css">
            body, p, div {
                font-family: trebuchet ms,helvetica,sans-serif;
                font-size: 14px;
            }
            body {
                color: #313139;
            }
            body a {
                color: #1188E6;
                text-decoration: none;
            }
            p { margin: 0; padding: 0; }
            table.wrapper {
                width:100% !important;
                table-layout: fixed;
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: 100%;
                -moz-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            img.max-width {
                max-width: 100% !important;
            }
            .column.of-2 {
                width: 50%;
            }
            .column.of-3 {
                width: 33.333%;
            }
            .column.of-4 {
                width: 25%;
            }
            @media screen and (max-width:480px) {
                .preheader .rightColumnContent,
                .footer .rightColumnContent {
                    text-align: left !important;
                }
                .preheader .rightColumnContent div,
                .preheader .rightColumnContent span,
                .footer .rightColumnContent div,
                .footer .rightColumnContent span {
                text-align: left !important;
                }
                .preheader .rightColumnContent,
                .preheader .leftColumnContent {
                font-size: 80% !important;
                padding: 5px 0;
                }
                table.wrapper-mobile {
                width: 100% !important;
                table-layout: fixed;
                }
                img.max-width {
                height: auto !important;
                max-width: 480px !important;
                }
                a.bulletproof-button {
                display: block !important;
                width: auto !important;
                font-size: 80%;
                padding-left: 0 !important;
                padding-right: 0 !important;
                }
                .columns {
                width: 100% !important;
                }
                .column {
                display: block !important;
                width: 100% !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                }
            }
            </style>
            <!--user entered Head Start-->
            
            <!--End Head user entered-->
        </head>
        <body>
            <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: trebuchet ms,helvetica,sans-serif; color: #313139; background-color: #FFFFFF;">
            <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                <tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                    <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                        <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td>
                                <!--[if mso]>
                                <center>
                                <table><tr><td width="600">
                                <![endif]-->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                                    <tr>
                                    <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #313139; text-align: left;" bgcolor="#FFFFFF" width="100%" align="left">
                                        
            <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
            <tr>
                <td role="module-content">
                <p>Procede a cambiar tu contraseña</p>
                </td>
            </tr>
            </table>
        
            <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
                <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:40% !important;width:40%;height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="240"></a>
                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:20px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div>
        <h2 style="text-align: center;">Password Recovery</h2>
        </div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:20px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div style="text-align: center;"><span style="font-size:18px;">Please click the next button to proceed to change your password:</span></div>

                </td>
            </tr>
            </table>
        <table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" class="outer-td" style="padding:0px 0px 0px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#333333" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit"><a href="${resetUrl.toString()}" style="background-color:#333333;border:1px solid #333333;border-color:#333333;border-radius:6px;border-width:1px;color:#ffffff;display:inline-block;font-family:arial,helvetica,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none" target="_blank">Reset password</a></td></tr></tbody></table></td></tr></tbody></table>
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div style="text-align: center;"><span style="color:#FF0000;"><em>This link will expire in 3 minutes.</em></span></div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div style="text-align: center;">
        <hr></div>
                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div><span style="color: rgb(49, 49, 57); font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">If you didn&#39;t request a Password Reset, then somebody else may be trying to take this action. We suggest to immediately change your e-mail account password for a stronger one, in case the person is also trying to infiltrate into your e-mail.</span></div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div><span style="color: rgb(49, 49, 57); font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">Remember that the strongest passwords are always the ones including symbols, numbers, upper, and lower case letters, in random order. This is why we highly recommend&nbsp;</span><strong style="color: rgb(49, 49, 57); font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; background-color: rgb(255, 255, 255);">Password Managers</strong><span style="color: rgb(49, 49, 57); font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">, as they can give you strong&nbsp;suggestions and save the password, so you can use them without the need to memorize them.&nbsp;</span><strong style="color: rgb(49, 49, 57); font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; background-color: rgb(255, 255, 255);">Password Managers</strong><span style="color: rgb(49, 49, 57); font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">&nbsp;are usually included and ready to use on systems, such as Apple,&nbsp;Microsoft, Google Chrome, etc.</span></div>

                </td>
            </tr>
            </table>
        
            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
                    height="100%"
                    valign="top"
                    bgcolor="">
                    <div>
        <table border="0" cellpadding="0" cellspacing="0" role="module" style="table-layout: fixed;" width="100%">
            <tbody>
                <tr>
                    <td bgcolor="" height="100%" style="padding-top: 18px; padding-bottom: 18px; line-height: 22px; text-align: inherit;" valign="top">
                    <div style="font-family: &quot;trebuchet ms&quot;, helvetica, sans-serif; font-size: 14px;">It is also recommended to enable&nbsp;<strong>MFA&nbsp;</strong>(<em>Multi-factor Authentication</em>) in the apps and services that provide it, to better secure your accounts.</div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>

                </td>
            </tr>
            </table>
        
                                    </td>
                                    </tr>
                                </table>
                                <!--[if mso]>
                                </td></tr></table>
                                </center>
                                <![endif]-->
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </div>
            </center>
        </body>
        </html>`
    }

    try {
        process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
        const query = await pool.query(`
           INSERT INTO scheduler_password_resets
           (email, token, expires_at) 
           VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
        `, [email, token]);
        if (query.rowCount === 0) {
            throw new Error("Failed insertion");
        }
        const sending = await sgMail.send(lang === "es" ? messageES : messageEN);
        if (sending[0].statusCode !== 202) {
            throw new Error("Failed sending email");
        }
        responseUrl.searchParams.append("code", "200");
    } catch (e) {
        responseUrl.searchParams.append("error", "500");
    }
    redirect(responseUrl.pathname + responseUrl.search);
}