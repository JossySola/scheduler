'use server'
import "server-only";
import pool from "@/app/lib/mocks/db";
import { encrypt, generateKmsDataKey, hashPasswordAction, isPasswordPwned } from "@/app/lib/utils";
import sgMail from "@sendgrid/mail";
import * as z from "zod/v4";
import { headers } from "next/headers";
import { UtilResponse } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";

export async function validateAction (state: { message: string, ok: boolean }, formData: FormData) {
  // Validates input
  // Checks password exposure
  // Sends confirmation email
  const requestHeaders = headers();
  const locale = (await requestHeaders).get("x-user-locale") || "en";

  const email = formData.get("email")?.toString();
  const username = formData.get("username")?.toString();
  const name = formData.get("name")?.toString();
  const birthday = formData.get("birthday")?.toString();
  const password = formData.get("password")?.toString();
  const confirmation = formData.get("confirmpwd")?.toString();
  // Are there empty fields?
  if (!name || !username || !birthday || !email || !password || !confirmation) {
    return {
      ok: false,
      message: locale === "es" ? "Hay campos sin llenar" : "Some fields are empty",
    };
  }
  // Does the user already exists?
  const user = await sql`
    SELECT id FROM scheduler_users
    WHERE email = ${email} OR username = ${username};
  `;
  if (user.rowCount && user.rowCount > 0 || user.rows.length) {
    return {
      ok: false, 
      message: locale === "es" ? "Este usuario ya existe" : "User already exists",
    }
  }
  // The user does not exist but the email to use is in the block list?
  const isBlocked = await sql`
    SELECT email FROM scheduler_blocked_emails
    WHERE email = ${email};
  `;
  if (isBlocked.rows.length) {
      return {
        ok: false,
        message: locale === "es" ? "Este correo electrónico ha sido bloqueado. Por favor contáctanos." : "This e-mail has been blocked. Please contact us.",
      }
  }
  // Is the password confirmed?
  if (password !== confirmation) {
    return {
      ok: false,
      message: locale === "es" ? "La confirmación de la contraseña es errónea" : "The password confirmation is incorrect",
    };
  }
  // Input validation
  const validName = z.string().min(3, { message: locale === "es" ? "El nombre es muy corto" : "Name too short" }).safeParse(name);
  const validUsername = z.string().min(3, { message: locale === "es" ? "El nombre de usuario es muy corto" : "Username too short" }).safeParse(username);
  const validBirthday = z.preprocess(
      (value) => (typeof value === "string" ? new Date(value) : value),
      z.date({ message: locale === "es" ? "Fecha inválida" : "Invalid date" })
  ).safeParse(birthday);
  const validEmail = z.email({ message: locale === "es" ? "Correo electrónico inválido" : "Invalid email address" }).safeParse(email);
  const validPassword = z.string().min(8, { message: locale === "es" ? "La contraseña debe tener al menos 8 caracteres" : "Password must have at least 8 characters" }).safeParse(password);
  // Collection of any Zod errors
  const errors = [ validName, validUsername, validBirthday, validEmail, validPassword]
  .filter(result => !result.success);
  if(errors && errors.length) {
    return {
      ok: false,
      message: errors[0].error?.issues[0].message ?? "",
    }
  }
  // Has the password been exposed in a data breach?
  const exposedPassword = await isPasswordPwned(password.toString());
  if (typeof exposedPassword !== 'number') {
    return {
      ok: false,
      message: locale === "es" ? 'El análisis de seguridad de la contraseña ha fallado' : 'The password security could not be checked',
    }
  }
  if (exposedPassword !== 0) {
    return {
      ok: false,
      message: locale === "es" ? 'Después de un análisis de seguridad, la contraseña que utilizaste ha sido expuesta previamente. Por favor crea una nueva contraseña más segura' : 'After a password check, the password provided has been exposed in a data breach. For security reason, please choose a stronger password.',
    }
  }
  // Send confirmation link
  const key = await generateKmsDataKey();
  if (!key) {
    return {
      ok: false,
      message: locale === "es" ? "Error al continuar con proceso de registro" : "Failed to continue with sign up process"
    }
  }
  
  const hashed = await hashPasswordAction(password);
  const token = await encrypt(`${email}/\/${username}/\/${name}/\/${birthday}/\/${hashed}/\/${password}`, key?.Plaintext);
  const registerToken = await sql`
    INSERT INTO scheduler_email_confirmation_tokens (token, key, expires_at, email)
    VALUES (${token}, ${key.CiphertextBlob}, CURRENT_TIMESTAMP + INTERVAL '1 minute', ${email});
  `;
  
  if (registerToken.rowCount === 0) {
    return {
      ok: false,
      message: locale === "es" ? "Error al continuar con proceso de registro" : "Failed to continue with sign up process"
    }
  }
  return await sendEmailAction(name, email, token, locale as "en" | "es");
}
export async function sendEmailAction (name: string, email: string, token: string, lang: "es" | "en"): Promise<UtilResponse> {
  if (!email || !name || !lang) {
    return {
      ok: false,
      message: 'Data is missing'
    }
  }
  const confirmURL = new URL(`${process.env.NEXT_PUBLIC_DEV_ORIGIN}/${lang}/confirm/v`);
  confirmURL.searchParams.set('token', token);
  confirmURL.searchParams.set('email', email);
  const msgEN = {
    to: `${email}`,
    from: 'no-reply@jossysola.com',
    subject: 'Scheduler: Confirm your e-mail',
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
          <p>Complete your sign up process</p>
        </td>
      </tr>
    </tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="k7kNAoP42RzSE3548Pb9qi">
        <tbody><tr>
          <td style="font-size:6px; line-height:10px; padding:28px 0px 38px 0px;" valign="top" align="center">
            <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:30% !important; width:30%; height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="180" data-proportionally-constrained="false" data-responsive="true"></a>
          </td>
        </tr>
      </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="hMHE9bJVUTwMzeHTbzCDTa">
        <tbody><tr>
          <td style="padding:18px 0px 18px 0px; line-height:30px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><h2 style="text-align: center">Welcome ${name}!</h2><div></div></div></td>
        </tr>
      </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="kXZBA9yKCY1Ma7D4z9Bs9o">
        <tbody><tr>
          <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Complete your sign up process by clicking the following button:</span></div><div></div></div></td>
        </tr>
      </tbody></table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="9b3b2fcc-cac5-4369-b3a5-c3559e2464dd">
        <tbody>
          <tr>
            <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 22px 0px;">
              <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                <tbody>
                  <tr>
                  <td align="center" bgcolor="#763da9" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                    <a href="${confirmURL}" style="background-color:#763da9; border:1px solid #763da9; border-color:#763da9; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:19px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Confirm &amp; Complete</a>
                  </td>
                  </tr>
                </tbody>
              </table>
            </td>
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
          <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #5a5959">If you didn't start a sign up process with us, please omit this e-mail</span></div><div></div></div></td>
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
      
    </body>
    </html>`
  }
  const msgES = {
    to: `${email}`,
    from: 'no-reply@jossysola.com',
    subject: 'Scheduler: Confirma tu correo electrónico',
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
          <p>Completa el proceso de registro</p>
        </td>
      </tr>
    </tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="k7kNAoP42RzSE3548Pb9qi">
        <tbody><tr>
          <td style="font-size:6px; line-height:10px; padding:28px 0px 38px 0px;" valign="top" align="center">
            <a href="https://scheduler.jossysola.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:30% !important; width:30%; height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/fe9956381f4ff77d654e980c6682f71f6afed535aec4ca776b38fe081887e010.png" alt="" width="180" data-proportionally-constrained="false" data-responsive="true"></a>
          </td>
        </tr>
      </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="hMHE9bJVUTwMzeHTbzCDTa">
        <tbody><tr>
          <td style="padding:18px 0px 18px 0px; line-height:30px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><h2 style="text-align: center">¡Bienvenidx ${name}!</h2><div></div></div></td>
        </tr>
      </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="kXZBA9yKCY1Ma7D4z9Bs9o">
        <tbody><tr>
          <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Ingresa al siguiente enlace para confirmar el correo electrónico y completar el proceso de registro:</span></div><div></div></div></td>
        </tr>
      </tbody></table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="9b3b2fcc-cac5-4369-b3a5-c3559e2464dd">
        <tbody>
          <tr>
            <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 22px 0px;">
              <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                <tbody>
                  <tr>
                  <td align="center" bgcolor="#763da9" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                    <a href="${confirmURL}" style="background-color:#763da9; border:1px solid #763da9; border-color:#763da9; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:19px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Confirmar y finalizar</a>
                  </td>
                  </tr>
                </tbody>
              </table>
            </td>
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
          <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #5a5959">Si no iniciaste el proceso de registro, por favor omite este mensaje.</span></div><div></div></div></td>
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
      
    </body>
  </html>`
  }
  try {
    process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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