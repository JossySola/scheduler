'use server'
import "server-only";
import pool from "@/app/lib/mocks/db";
import { isPasswordPwned } from "@/app/lib/utils";
import sgMail from "@sendgrid/mail";
import { randomBytes } from "crypto";
import { signIn } from "@/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { UtilResponse } from "@/app/lib/definitions";

export async function validateAction (state: { message: string }, formData: FormData) {
    const requestHeaders = headers();
    const locale = (await requestHeaders).get("x-user-locale") || "en";

    const name = formData.get("name")?.toString();
    const username = formData.get("username")?.toString();
    const birthday = formData.get("birthday")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmation = formData.get("confirmpwd")?.toString();
    
    if (!name || !username || !birthday || !email || !password || !confirmation) {
        return {
            ok: false,
            message: locale === "es" ? "Hay campos sin llenar" : "Some fields are empty"
        };
    }
    
    if (password !== confirmation) {
        return {
            ok: false,
            message: locale === "es" ? "La confirmación de la contraseña es errónea" : "The password confirmation is incorrect"
        };
    }

    const validName = z.string().min(3, { message: locale === "es" ? "El nombre es muy corto" : "Name too short" }).safeParse(name);
    const validUsername = z.string().min(3, { message: locale === "es" ? "El nombre de usuario es muy corto" : "Username too short" }).safeParse(username);
    const validBirthday = z.preprocess(
        (value) => (typeof value === "string" ? new Date(value) : value),
        z.date({ message: locale === "es" ? "Fecha inválida" : "Invalid date" })
    ).safeParse(birthday);
    const validEmail = z.string().min(1).email({ message: locale === "es" ? "Correo electrónico inválido" : "Invalid email address" }).safeParse(email);
    const validPassword = z.string().min(8, { message: locale === "es" ? "La contraseña debe tener al menos 8 caracteres" : "Password must have at least 8 characters" }).safeParse(password);
    
    const request = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/verify/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
        }),
    });

    const response = await request.json();
    const userExists = request.status === 200 ? {
              error: {
                  issues: [{ message: response.statusText }],
              },
          }
    : { success: true };
    const errors = [userExists, validName, validUsername, validBirthday, validEmail, validPassword]
    .filter((result) => !result.success);

    const exposedPassword = await isPasswordPwned(password.toString());
    if (typeof exposedPassword !== 'number') {
        return {
            ok: false,
            message: exposedPassword.message,
            descriptive: [...errors, { error: { issues: [{ message: exposedPassword.message }] } }],
        }
    }
    
    if (exposedPassword !== 0) {
        return {
            ok: false,
            message: locale === "es" ? 'Después de un análisis, la contraseña que utilizaste ha sido reportada en la lista de contraseñas expuestas. Por favor crea una contraseña más segura' : 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.',
            descriptive: [...errors, { error: { issues: [{ message: locale === "es" ? 'Después de un análisis, la contraseña que utilizaste ha sido reportada en la lista de contraseñas expuestas. Por favor crea una contraseña más segura' : 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.' }] } }],
        }
    }
    
    const existQuery = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/user/id`, {
        method: 'GET', 
        headers: {
            "user_email": email.toString()
        }
    })
    const doesExist = await existQuery.json();
    
    if (doesExist.error === 'User not found') {
        await sendTokenAction(formData, locale as "en" | "es");
    }
    
    return {
        ok: true,
        message: errors.length ? "Validation failed" : "Validation successful",
        descriptive: errors,
    };
}

export async function verifyTokenAction (state: { message: string }, formData: FormData) {
    const token = formData.get('confirmation-token')?.toString();
    const name = formData.get('name')?.toString();
    const username = formData.get('username')?.toString();
    const birthday = formData.get('birthday')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    const requestHeaders = await headers();
    const locale = requestHeaders.get("x-user-locale")?.toString() || "en";

    console.error("[confirmEmailAction] Starting...")
    console.error("[confirmEmailAction] Checking if token exists...")
    if (!token) {
        console.error("[confirmEmailAction] Token doesn't exist, exiting...")
        return {
            ok: false,
            message: locale === "es" ? 
                "Por favor ingresa el código enviado a tu correo electrónico" : 
                "Please type the code sent to your email in the field above"
        }
    }
    
    if (!name || !username || !birthday || !email || !password) {
        console.error("[confirmEmailAction] Some data is missing, exiting...")
        return {
            ok: false,
            message: locale === "es" ? 
            "Falta información" : 
            "Some data is missing"
        }
    }
    console.error("[confirmEmailAction] Entering handleEmailConfirmation...")
    const confirm = await handleEmailConfirmation(token, email);
    console.error("[confirmEmailAction] Function result:", confirm)
    if (confirm.ok === false) {
        return {
            ok: false,
            message: confirm.message
        }
    }
    console.error("[confirmEmailAction] Connecting to /api/signup...")
    const signup = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/signup`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            username,
            email,
            birthday,
            password,
        })
    })
    console.error("[confirmEmailAction] Endpoint result:", signup)
    if (signup.status !== 200 || !signup.ok) {
        console.error("[confirmEmailAction] Endpoint result failed:", signup)
        return {
            ok: false,
            message: locale === "es" ? 
            "Registro fallido" : 
            "Failed to register record"
        }
    }
    console.error("[confirmEmailAction] Starting handleLogin...")
    const logging = await handleLogin(username, password, locale);
    console.error("[confirmEmailAction] Result while logging:", logging)
    console.error("[confirmEmailAction] Exiting...")
    return {
        ok: true,
        message: locale === "es" ? 
        "Registro completado" : 
        "Signup process successfuly complete"
    }
}

export async function sendTokenAction (formData: FormData, lang: "es" | "en"): Promise<UtilResponse> {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();

    if (!email || !name || !lang) {
      return {
        ok: false,
        message: 'Data is missing'
      }
    }
    
    const verification_code = randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
  
    const msgEN = {
      to: `${email}`,
      from: 'no-reply@jossysola.com',
      subject: 'Scheduler: Confirm your e-mail',
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
          <head>
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
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tr>
                                              <td role="modules-container" style="padding:0px 0px 0px 0px; color:#313139; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tr>
            <td role="module-content">
              <p>Complete your signup process</p>
            </td>
          </tr>
        </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="k7kNAoP42RzSE3548Pb9qi">
            <tr>
              <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="240" height="" data-proportionally-constrained="false" data-responsive="false"></a>
              </td>
            </tr>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="hMHE9bJVUTwMzeHTbzCDTa">
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:30px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><h2 style="text-align: center">Welcome ${name}!</h2><div></div></div></td>
            </tr>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="kXZBA9yKCY1Ma7D4z9Bs9o">
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Enter the next code into the website to confirm your email and complete the sign up process:</span></div><div></div></div></td>
            </tr>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b9d76e66-ee13-4fdb-a1d8-5d72aac2f7be" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:23px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><h3 style="text-align: center"><span style="font-size: 18px; color: #09a8dd; font-family: georgia, serif">${verification_code}</span></h3><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="e5b3ec51-1a80-4db1-bc13-3b02130d386e">
          <tbody>
            <tr>
              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 1px 0px;" bgcolor="#afafaf"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="46a52f7d-38af-4cf6-bb2f-75c1e46cdc67" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center">If you didn't start this signup process please omit this e-mail.</div><div></div></div></td>
            </tr>
          </tbody>
        </table></td>
                                            </tr>
                                          </table>
                                          <!--[if mso]>
                                        </td>
                                      </tr>
                                    </table>
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
    const msgES = {
      to: `${email}`,
      from: 'no-reply@jossysola.com',
      subject: 'Scheduler: Confirma tu correo electrónico',
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
          <head>
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
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tr>
                                              <td role="modules-container" style="padding:0px 0px 0px 0px; color:#313139; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tr>
            <td role="module-content">
              <p>Completa el proceso de registro</p>
            </td>
          </tr>
        </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="k7kNAoP42RzSE3548Pb9qi">
            <tr>
              <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="240" height="" data-proportionally-constrained="false" data-responsive="false"></a>
              </td>
            </tr>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="hMHE9bJVUTwMzeHTbzCDTa">
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:30px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><h2 style="text-align: center">¡Bienvenidx ${name}!</h2><div></div></div></td>
            </tr>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="kXZBA9yKCY1Ma7D4z9Bs9o">
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Ingresa el siguiente código en la página para confirmar tu correo electrónico y completar el proceso de registro:</span></div><div></div></div></td>
            </tr>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b9d76e66-ee13-4fdb-a1d8-5d72aac2f7be" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:23px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><h3 style="text-align: center"><span style="font-size: 18px; color: #09a8dd; font-family: georgia, serif">${verification_code}</span></h3><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="e5b3ec51-1a80-4db1-bc13-3b02130d386e">
          <tbody>
            <tr>
              <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
                <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                  <tbody>
                    <tr>
                      <td style="padding:0px 0px 1px 0px;" bgcolor="#afafaf"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="46a52f7d-38af-4cf6-bb2f-75c1e46cdc67" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center">Si no iniciaste el proceso de registro, por favor omite este mensaje.</div><div></div></div></td>
            </tr>
          </tbody>
        </table></td>
                                            </tr>
                                          </table>
                                          <!--[if mso]>
                                        </td>
                                      </tr>
                                    </table>
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
      const insertToken = await pool.query(`
        INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
          VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '1 minute');
      `, [verification_code, email]);
      
      if (insertToken.rowCount === 0) {
        return {
          ok: false,
          message: lang === "es" ? "Error inesperado, inténtalo más tarde" : "Unexpected error, try again later"
        };
      }
      
      const sendConfirmation = await sgMail.send(lang === "es" ? msgES : msgEN);
      if (sendConfirmation[0].statusCode !== 202) {
          return {
              ok: false,
              message: lang === "es" ? "El correo electrónico no pudo ser enviado" : "The e-mail could not be sent"
          }
      }
      return {
        ok: true,
        message: lang === "es" ? "¡Código enviado!" : "Code sent!"
      }
    } catch (error) {
      return {
        ok: false,
        message: lang === "es" ? "Error en el servidor" : "Server Error"
      }
    }
  }

async function handleEmailConfirmation (token: string, email: string) {
    const headerList = await headers();
    const lang = headerList.get("x-user-locale")?.toString() || "en";

    console.error("[handleEmailConfirmation] Starting...")
    console.error("[handleEmailConfirmation] Checking if data exist...")
    if (!token || !email) {
        console.error("[handleEmailConfirmation] Some data don't exist")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: lang === "es" ? 
            "Falta información" : 
            "Data missing"
        }
    }
    console.error("[handleEmailConfirmation] Starting query...")
    console.error("[handleEmailConfirmation] SELECT token WHERE token AND email")
    const confirming = await pool.query(`
        SELECT token 
        FROM scheduler_email_confirmation_tokens
        WHERE email = $1 
            AND token = $2 
            AND expires_at > NOW();
    `, [email, token]);
    console.error("[handleEmailConfirmation] Query result:", confirming)
    if (!confirming || confirming.rowCount === 0) {
        console.error("[handleEmailConfirmation] Query failed")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: lang === "es" ? 
            "El código es erróneo o ha expirado" : 
            "The code is incorrect or has expired"
        }
    }
    console.error("[handleEmailConfirmation] Starting query...")
    console.error("[handleEmailConfirmation] DELETE row")
    const deleting = await pool.query(`
        DELETE FROM scheduler_email_confirmation_tokens
        WHERE email = $1 AND token = $2;
    `, [email, token]);
    console.error("[handleEmailConfirmation] Query result:", deleting)
    if (deleting.rowCount === 0) {
        console.error("[handleEmailConfirmation] Query failed")
        console.error("[handleEmailConfirmation] Exiting...")
        return {
            ok: false,
            message: lang === "es" ? 
            "Error Interno" : 
            "Failed to consume"
        }
    }
    console.error("[handleEmailConfirmation] Exiting...")
    return {
        ok: true,
        message: lang === "es" ? 
        "¡Correo electrónico confirmado!" : 
        "Email confirmed!"
    }
}

async function handleLogin (username: string, password: string, locale: string) {
    const headerList = await headers();
    const lang = headerList.get("x-user-locale")?.toString() || "en";
    console.error("[handleLogin] Starting...")
    console.error("[handleLogin] Checking if necessary data exist...")
    if (!username || !password) {
        console.error("[handleLogin] Some data is missing, exiting...")
        return {
            ok: false,
            message: lang === "es" ? 
            "Fallo en inicio de sesión" : 
            "Failed to login"
        }
    }
    console.error("[handleLogin] Signing in...")
    const signing = await signIn('credentials', {
        redirect: true,
        redirectTo: `/${locale}/dashboard`,
        username,
        password,
    })
    console.error("[handleLogin] Signin result:", signing)
}