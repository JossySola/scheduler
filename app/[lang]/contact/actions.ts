"use server"
import "server-only"
import sgMail from "@sendgrid/mail";
import { headers } from "next/headers";

export default async function contactAction (previousState: { ok: boolean, message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";
    const subject = formData.get("subject");
    const email = formData.get("email");
    const message = formData.get("message");
    const name = formData.get("name");
    const msg = {
        to: "contact@jossysola.com",
        from: "no-reply@jossysola.com",
        subject: `User message, ${subject?.toString().toUpperCase()}`,
        html: `
        <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <!--<![endif]-->
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
            ul ul ul ul  {
            list-style-type: disc !important;
            }
            ol ol {
            list-style-type: lower-roman !important;
            }
            ol ol ol {
            list-style-type: lower-latin !important;
            }
            ol ol ol ol {
            list-style-type: decimal !important;
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
                max-width: 100% !important;
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
            .social-icon-column {
                display: inline-block !important;
            }
            }
        </style>
            <!--user entered Head Start-->
            
            <!--End Head user entered-->
            </head>
            <body>
            <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:trebuchet ms,helvetica,sans-serif; color:#313139; background-color:#FFFFFF;">
                <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                    <tbody><tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                        <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                            <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tbody><tr>
                                <td>
                                    <!--[if mso]>
            <center>
            <table><tr><td width="600">
        <![endif]-->
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tbody><tr>
                                                <td role="modules-container" style="padding:0px 0px 0px 0px; color:#313139; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
            <tbody><tr>
            <td role="module-content">
                <p>User is contacting...</p>
            </td>
            </tr>
        </tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="k7kNAoP42RzSE3548Pb9qi">
            <tbody><tr>
                <td style="font-size:6px; line-height:10px; padding:15px 0px 0px 0px;" valign="top" align="center">
                <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="150" height="" data-proportionally-constrained="false" data-responsive="false"></a>
                </td>
            </tr>
            </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="5d664be3-41f1-40bf-bf18-a066d6fc6572">
            <tbody>
            <tr>
                <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit"><span style="font-size: 18px">Name: ${name}</span></div>
        <div style="font-family: inherit"><span style="font-size: 18px">E-mail: ${email}</span></div>
        <div style="font-family: inherit"><span style="font-size: 18px">Subject: ${subject}</span></div><div></div></div></td>
            </tr>
            </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6dc5a8fd-72da-4072-9ca2-e66fbb48bf3d">
            <tbody>
            <tr>
                <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                    <tbody>
                    <tr>
                        <td style="padding:0px 0px 1px 0px;" bgcolor="#676767"></td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </tr>
            </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="25151184-8962-4556-98a3-2cbeb3eceac7">
            <tbody>
            <tr>
                <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit">${message}</div><div></div></div></td>
            </tr>
            </tbody>
        </table></td>
                                            </tr>
                                            </tbody></table>
                                            <!--[if mso]>
                                        </td>
                                        </tr>
                                    </table>
                                    </center>
                                    <![endif]-->
                                </td>
                                </tr>
                            </tbody></table>
                            </td>
                        </tr>
                        </tbody></table>
                    </td>
                    </tr>
                </tbody></table>
                </div>
            </center>
            
        </body></html>
        `
    }
    if (!subject || !email || !message || !name) {
        return {
            ok: false,
            message: locale === "es" ? "Por favor, llena todos los campos" : "Please fill out all fields",
        }
    }
    try {
        process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const mail = await sgMail.send(msg);
        if (mail[0].statusCode !== 202) {
            throw new Error();
        } 
        return {
            ok: true,
            message: locale === "es" ? "¡Mensaje enviado!" : "Message sent!",
        }

    } catch (e) {
        return {
            ok: false,
            message: locale === "es" ? "El mensaje no pudo ser enviado" : "The message couldn't be sent",
        }
    }
    
}