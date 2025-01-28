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
export async function sendResetPasswordConfirmation(email: string | undefined): Promise<UtilResponse> {
  console.error("[sendResetPasswordConfirmation] Starting...")
  console.error("[sendResetPasswordConfirmation] Checking necessary data exists...")
  if (!email) {
    console.error("[sendResetPasswordConfirmation] Data is missing, exiting...")
    return {
      ok: false,
      message: 'Email must be provided'
    }
  }
  console.error("[sendResetPasswordConfirmation] Validating data with Zod...")
  const validated = z.string().min(1).email({ message: "Invalid e-mail" }).safeParse(email);
  console.error("[sendResetPasswordConfirmation] Zod validation:", validated)
  if (!validated) {
    console.error("[sendResetPasswordConfirmation] Validation unsuccessful, exiting...")
    return {
      ok: false,
      message: validated
    }
  }
  console.error("[sendResetPasswordConfirmation] Starting query...")
  console.error("[sendResetPasswordConfirmation] SELECT email...")
  const confirming = await pool.query(`
      SELECT email FROM scheduler_users
        WHERE email = $1;
  `, [email])
  console.error("[sendResetPasswordConfirmation] Query result:", confirming)
  if (confirming.rowCount === 0 || !confirming) {
    console.error("[sendResetPasswordConfirmation] Record not found, exiting...")
    return {
      ok: false,
      message: 'Email not found'
    }
  }
  console.error("[sendResetPasswordConfirmation] Generating random code...")
  const verification_code = randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6); 
  console.error("[sendResetPasswordConfirmation] Code:", verification_code)
  console.error("[sendResetPasswordConfirmation] Setting sgMail API key...")
  process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.error("[sendResetPasswordConfirmation] Creating msg Object...")
  const msg = {
    to: `${email}`,
    from: 'no-reply@jossysola.com',
    subject: 'Scheduler: Reset password confirmation',
    text: `${verification_code}`
  }
  console.error("[sendResetPasswordConfirmation] Entering try block...")
  try {
    console.error("[sendResetPasswordConfirmation] Starting query...")
    console.error("[sendResetPasswordConfirmation] INSERT token INTO confirmations")
    const insertToken = await pool.query(`
      INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
    `, [verification_code, email]);
    console.error("[sendResetPasswordConfirmation] Query result:", insertToken)
    if (insertToken.rowCount === 0) {
      console.error("[sendResetPasswordConfirmation] Token failed to insert, exiting...")
      throw new Error('Server Error');
    }
    console.error("[sendResetPasswordConfirmation] Sending email...")
    const sending = await sgMail.send(msg)
    console.error("[sendResetPasswordConfirmation] Sender response:", sending)
    if (sending[0].statusCode !== 202) {
      console.error("[sendResetPasswordConfirmation] Send unsuccessful, exiting...")
      return {
        ok: false,
        message: 'Error at mail provider'
      }
    }
    console.error("[sendResetPasswordConfirmation] Email sent, exiting...")
    return {
      ok: true,
      message: 'Code sent!'
    }
  } catch (error) {
    console.error("[sendResetPasswordConfirmation] Entering catch block...")
    console.error("[sendResetPasswordConfirmation] Error:", error)
    console.error("[sendResetPasswordConfirmation] Exiting...")
    return {
      ok: false,
      message: 'Server failure'
    }
  }
}
export async function sendEmailConfirmation(email: string, name?: string): Promise<UtilResponse> {
  console.error("[sendEmailConfirmation] Starting...")
  console.error("[sendEmailConfirmation] Creating code...")
  const verification_code = randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
  console.error("[sendEmailConfirmation] Code:", verification_code)
  console.error("[sendEmailConfirmation] Setting sgMail API key...")
  process.env.SENDGRID_API_KEY && sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.error("[sendEmailConfirmation] Creating msg Object...")
  const msg = {
      to: `${email}`,
      from: 'no-reply@jossysola.com',
      subject: 'Scheduler: Confirm your e-mail',
      html: `<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
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
    font-family: arial,helvetica,sans-serif;
    font-size: 14px;
  }
  body {
    color: #000000;
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
    <!--user entered Head Start--><!--End Head user entered-->
  </head>
  <body>
    <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
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
                                      <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
  <tbody><tr>
    <td role="module-content">
      <p>Please confirm your e-mail</p>
    </td>
  </tr>
</tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a9d37433-ad4f-4657-b298-e43ef1868d4f" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><h1 style="text-align: inherit">Welcome ${name ? name : ''} to Scheduler!</h1><div></div></div></td>
    </tr>
  </tbody>
</table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a9d37433-ad4f-4657-b298-e43ef1868d4f.1" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: start"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-alternates: inherit; font-variant-position: inherit; font-variant-emoji: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-size-adjust: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; color: #000000; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: preserve; text-wrap-mode: wrap; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px">Please confirm your e-mail by typing the next code to the website:</span></div>
<div style="font-family: inherit; text-align: start"><br></div>
<div style="font-family: inherit; text-align: inherit; margin-left: 0px"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-alternates: inherit; font-variant-position: inherit; font-variant-emoji: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-size-adjust: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: preserve; text-wrap-mode: wrap; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 15px; color: #5c5c5c">Por favor, confirma tu e-mail escribiendo el siguiente código en la página</span><span style="font-size: 14px; color: #afafaf">&nbsp;</span></div><div></div></div></td>
    </tr>
  </tbody>
</table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a9d37433-ad4f-4657-b298-e43ef1868d4f.1.1" data-mc-module-version="2019-10-22">
  <tbody>
    <tr>
      <td style="padding:18px 0px 18px 0px; line-height:13px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: start"><span style="font-family: &quot;arial black&quot;, helvetica, sans-serif; color: #09a8dd; font-size: 24px">${verification_code}</span></div><div></div></div></td>
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
  
</body></html>`
  }
  console.error("[sendEmailConfirmation] Entering try block...")
  try {
    console.error("[sendEmailConfirmation] Starting query...")
    console.error("[sendEmailConfirmation] INSERT token INTO confirmations...")
    const insertToken = await pool.query(`
      INSERT INTO scheduler_email_confirmation_tokens (token, email, expires_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '3 minutes');
    `, [verification_code, email]);
    console.error("[sendEmailConfirmation] Query result:", insertToken)
    if (insertToken.rowCount === 0) {
      console.error("[sendEmailConfirmation] INSERT failed")
      console.error("[sendEmailConfirmation] Exiting...")
      throw new Error('Server Error');
    }
    console.error("[sendEmailConfirmation] Sending email...")
    const sendConfirmation = await sgMail.send(msg)
    if (sendConfirmation[0].statusCode !== 202) {
      console.error("[sendEmailConfirmation] Send failed, exiting...")
        return {
            ok: false,
            message: "The code couldn't be sent"
        }
    }
    console.error("[sendEmailConfirmation] Email sent")
    console.error("[sendEmailConfirmation] Exiting...")
    return {
      ok: true,
      message: 'Code sent!'
    }
  } catch (error) {
    console.error("[sendEmailConfirmation] Entering catch block...")
    console.error("[sendEmailConfirmation] Error:", error)
    console.error("[sendEmailConfirmation] Exiting...")
    return {
      ok: false,
      message: 'Server failure'
    }
  }
}