'use server'
import "server-only";
import crypto, { randomBytes } from "crypto";
import pool from "./mocks/db";
import { Argon2id } from "oslo/password";
import sgMail from "@sendgrid/mail";
import { z } from "zod";
import { UserResponse, UtilResponse } from "./definitions";

export async function getUserFromDb (username: string, password: string): Promise<UtilResponse & UserResponse> {
  if (!username || !password) {
    return {
      message: "Data missing",
      provider: "",
      ok: false,
    }
  }
  
  try {
    const user = await pool.query(`
        SELECT * FROM scheduler_users 
            WHERE username = $1 OR email = $1;
    `, [username]);
    
    if (user.rowCount === 0) {
      return {
        message: "User not found",
        provider: "",
        ok: false,
      }
    }
    
    const userRecord = user.rows[0];
    
    if (userRecord.password === null) {
      const provider = await pool.query(`
        SELECT provider FROM scheduler_users_providers
        WHERE email = $1;
      `, [userRecord.email]);
      const name = provider.rowCount === 2 ? `${provider.rows[0].provider} and ${provider.rows[1].provider}` : `${provider.rows[0]}`;

      return {
        message: `This account uses ${name} authentication.`,
        provider: name,
        ok: false
      }
    }
    
    const argon2id = new Argon2id();
    const hashVerified = await argon2id.verify(userRecord.password, password);

    if (hashVerified) {
      return {
          id: userRecord.id,
          name: userRecord.name,
          username: userRecord.username,
          email: userRecord.email,
          role: userRecord.role,
          message: "",
          ok: true
      };
    }
    throw new Error ("Invalid credentials");
  } catch (error) {
    return {
      message: "Invalid credentials",
      ok: false,
    }
  }
}
export async function isPasswordPwned (password: string): Promise<number | UtilResponse> {
  if (!password) throw new Error("No password received")
  try {
      // API requires password to be hashed with SHA1
      const hashed = crypto.createHash('sha1').update(password).digest('hex');
      // "range" endpoint requires only the first 5 characters of the hashed password
      const range = hashed.slice(0,5);
      const suffixToCheck = hashed.slice(5).toUpperCase();
      const response = await fetch(`https://api.pwnedpasswords.com/range/${range}`);
      // The API returns a plain text response, not a JSON
      const text = await response.text();
      // For each \n break, convert the plain text into an Array
      const lines = text.split('\n');
      for (const line of lines) {
          // The format of each line is divided by a ":", the left part is the suffix and the right part is the count
          const [hashSuffix, count] = line.split(':');
          // If the rest of the hashed password is found on the exposed list
          if (hashSuffix.includes(suffixToCheck)) {
              // return the count part as a number
              return parseInt(count, 10);
          }
      }
      // If the remaining part of the hashed password is not found on the list, return 0
      return 0;
  } catch (error) {
      return {
          message: "Unknown error from exposed password checking.",
          ok: false
      };
  }
}
export async function sendResetPasswordConfirmation (email: string): Promise<UtilResponse> {
  if (!email) {
    return {
      ok: false,
      message: 'Email must be provided'
    }
  }
  const validated = z.string().min(1).email({ message: "Invalid e-mail" }).safeParse(email);
  if (!validated.success) {
    return {
      ok: false,
      message: validated.error?.issues?.[0]?.message || "Unknown validation error"
    }
  }
  const confirming = await pool.query(`
      SELECT email FROM scheduler_users
      WHERE email = $1;
  `, [email])
  
  if (confirming.rowCount === 0 || !confirming) {
    return {
      ok: false,
      message: 'Email not found'
    }
  }
  const verification_code = randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
  const msg = {
    to: `${email}`,
    from: 'no-reply@jossysola.com',
    subject: 'Scheduler: Reset password confirmation',
    text: `${verification_code}`
  }
  try {
    process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const insertToken = await pool.query(`
      INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
    `, [verification_code, email]);
    if (insertToken.rowCount === 0) {
      throw new Error('Server Error');
    }
    const sending = await sgMail.send(msg)
    if (sending[0].statusCode !== 202) {
      return {
        ok: false,
        message: 'Error at mail provider'
      }
    }
    return {
      ok: true,
      message: 'Code sent!'
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Server failure'
    }
  }
}
export async function sendEmailConfirmation(email: string, name: string, lang: "es" | "en"): Promise<UtilResponse> {
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