import "dotenv/config";

import { Resend } from "resend";
import { escapeHtml } from "../utils/escapeHtml.js";


/* =========================
   CONFIGURATION
========================= */

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY manquante.");
  }

  return new Resend(process.env.RESEND_API_KEY);
}


function getMailConfig() {
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  if (!from) {
    throw new Error("MAIL_FROM manquant.");
  }

  if (!to) {
    throw new Error("MAIL_TO manquant.");
  }

  return {
    from,
    to,
  };
}


/* =========================
   HELPERS EMAIL
========================= */

function renderInfoRow(label, value) {
  return `
    <tr>
      <td
        style="
          padding: 14px 0;
          border-bottom: 1px solid #ececec;
          vertical-align: top;
          width: 150px;
          color: #777777;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          line-height: 1.5;
        "
      >
        ${label}
      </td>

      <td
        style="
          padding: 14px 0;
          border-bottom: 1px solid #ececec;
          vertical-align: top;
          color: #101010;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        "
      >
        ${value}
      </td>
    </tr>
  `;
}


function renderEmailLayout({
  eyebrow,
  title,
  subtitle,
  content,
  replyEmail,
  replyLabel,
}) {
  return `
    <!doctype html>

    <html lang="fr">

      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${title}</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f3f0;
        "
      >

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #f4f3f0;
          "
        >

          <tr>

            <td
              align="center"
              style="
                padding: 40px 16px;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  width: 100%;
                  max-width: 680px;
                  margin: 0 auto;
                "
              >


                <!-- =========================
                     BRAND
                ========================== -->

                <tr>

                  <td
                    style="
                      padding: 0 4px 20px;
                    "
                  >

                    <div
                      style="
                        color: #0d2342;
                        font-family: Georgia, 'Times New Roman', serif;
                        font-size: 20px;
                        font-weight: 600;
                        letter-spacing: 0.03em;
                      "
                    >
                      Stellenbosch Conseil
                    </div>

                    <div
                      style="
                        width: 46px;
                        height: 2px;
                        margin-top: 12px;
                        background-color: #b89a5b;
                      "
                    ></div>

                  </td>

                </tr>


                <!-- =========================
                     MAIN CARD
                ========================== -->

                <tr>

                  <td
                    style="
                      overflow: hidden;
                      background-color: #ffffff;
                      border-radius: 4px;
                      box-shadow:
                        0 6px 30px rgba(13, 35, 66, 0.08);
                    "
                  >


                    <!-- HEADER -->

                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        width: 100%;
                        background-color: #0d2342;
                      "
                    >

                      <tr>

                        <td
                          style="
                            padding:
                              42px
                              46px
                              38px;
                          "
                        >

                          <div
                            style="
                              margin-bottom: 14px;
                              color: #b89a5b;
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 11px;
                              font-weight: 700;
                              letter-spacing: 0.18em;
                              text-transform: uppercase;
                            "
                          >
                            ${eyebrow}
                          </div>


                          <h1
                            style="
                              margin: 0;
                              color: #ffffff;
                              font-family: Georgia, 'Times New Roman', serif;
                              font-size: 32px;
                              font-weight: 400;
                              line-height: 1.15;
                            "
                          >
                            ${title}
                          </h1>


                          <p
                            style="
                              max-width: 500px;
                              margin: 15px 0 0;
                              color: rgba(255, 255, 255, 0.7);
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 14px;
                              line-height: 1.65;
                            "
                          >
                            ${subtitle}
                          </p>

                        </td>

                      </tr>

                    </table>


                    <!-- BODY -->

                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                    >

                      <tr>

                        <td
                          style="
                            padding:
                              38px
                              46px
                              42px;
                          "
                        >

                          ${content}


                          <!-- =========================
                               CTA
                          ========================== -->

                          <table
                            role="presentation"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            style="
                              margin-top: 34px;
                            "
                          >

                            <tr>

                              <td
                                style="
                                  background-color: #315f9d;
                                  border-radius: 3px;
                                "
                              >

                                <a
                                  href="mailto:${replyEmail}"
                                  style="
                                    display: inline-block;
                                    padding:
                                      14px
                                      22px;
                                    color: #ffffff;
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 13px;
                                    font-weight: 700;
                                    letter-spacing: 0.03em;
                                    text-decoration: none;
                                  "
                                >
                                  ${replyLabel} →
                                </a>

                              </td>

                            </tr>

                          </table>



                        </td>

                      </tr>

                    </table>

                  </td>

                </tr>


                <!-- =========================
                     FOOTER
                ========================== -->

                <tr>

                  <td
                    align="center"
                    style="
                      padding: 24px 16px 0;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        color: #999999;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 11px;
                        line-height: 1.7;
                      "
                    >
                      Message transmis depuis le site
                      Stellenbosch Conseil.
                    </p>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

        </table>

      </body>

    </html>
  `;
}


/* =========================
   CLIENT
========================= */

export async function sendClientEmail({
  name,
  company,
  email,
  phone,
  request,
}) {
  const resend = getResendClient();

  const { from, to } = getMailConfig();


  const safeName =
    escapeHtml(name);

  const safeCompany =
    escapeHtml(
      company || "Non renseignée"
    );

  const safeEmail =
    escapeHtml(email);

  const safePhone =
    escapeHtml(
      phone || "Non renseigné"
    );

  const safeRequest =
    escapeHtml(request)
      .replace(
        /\r?\n/g,
        "<br />"
      );


  const content = `

    <!-- INFORMATIONS -->

    <div
      style="
        margin-bottom: 32px;
      "
    >

      <div
        style="
          margin-bottom: 8px;
          color: #b89a5b;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        "
      >
        Coordonnées
      </div>


      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >

        ${renderInfoRow(
          "Nom",
          safeName
        )}

        ${renderInfoRow(
          "Société",
          safeCompany
        )}

        ${renderInfoRow(
          "E-mail",
          `
            <a
              href="mailto:${safeEmail}"
              style="
                color: #315f9d;
                text-decoration: none;
              "
            >
              ${safeEmail}
            </a>
          `
        )}

        ${renderInfoRow(
          "Téléphone",
          safePhone
        )}

      </table>

    </div>


    <!-- DEMANDE -->

    <div
      style="
        margin-top: 36px;
      "
    >

      <div
        style="
          margin-bottom: 12px;
          color: #b89a5b;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        "
      >
        Demande du client
      </div>


      <div
        style="
          padding:
            24px
            26px;
          background-color: #f7f5f1;
          border-left: 3px solid #b89a5b;
        "
      >

        <p
          style="
            margin: 0;
            color: #202020;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 17px;
            line-height: 1.75;
          "
        >
          ${safeRequest}
        </p>

      </div>

    </div>
  `;


  const html =
    renderEmailLayout({
      eyebrow:
        "Nouvelle demande · Espace clients",

      title:
        "Un client souhaite échanger avec vous",

      subtitle:
        "Une nouvelle demande de recrutement vient d’être envoyée depuis le site Stellenbosch Conseil.",

      content,

      replyEmail:
        safeEmail,

      replyLabel:
        `Répondre à ${safeName}`,
    });


  const { data, error } =
    await resend.emails.send({

      from,

      to: [to],

      replyTo: email,

      subject:
        `Nouvelle demande client — ${name}`,

      html,

      text: `
STELLENBOSCH CONSEIL
Nouvelle demande client

Nom : ${name}
Société : ${company || "Non renseignée"}
E-mail : ${email}
Téléphone : ${phone || "Non renseigné"}

DEMANDE
--------------------------------

${request}

--------------------------------

Vous pouvez répondre directement à cet e-mail pour contacter ${name}.
      `.trim(),

    });


  if (error) {
    console.error(
      "Erreur Resend :",
      error
    );

    throw new Error(
      error.message ||
      "Impossible d'envoyer l'e-mail."
    );
  }


  return data;
}


/* =========================
   CANDIDAT
========================= */

export async function sendCandidateEmail({
  firstname,
  lastname,
  email,
  phone,
  position,
  cv,
}) {
  const resend =
    getResendClient();

  const { from, to } =
    getMailConfig();


  const safeFirstname =
    escapeHtml(firstname);

  const safeLastname =
    escapeHtml(lastname);

  const safeEmail =
    escapeHtml(email);

  const safePhone =
    escapeHtml(
      phone || "Non renseigné"
    );

  const safePosition =
    escapeHtml(position);


  /* =========================
     ATTACHMENT
  ========================= */

  const attachments = [];


  if (cv) {
    const safeFilename =
      cv.originalname.replace(
        /[^\p{L}\p{N}._ -]/gu,
        "_"
      );


    attachments.push({
      filename:
        safeFilename,

      content:
        cv.buffer.toString(
          "base64"
        ),
    });
  }


  /* =========================
     TEMPLATE
  ========================= */

  const content = `

    <!-- PROFIL -->

    <div
      style="
        margin-bottom: 32px;
      "
    >

      <div
        style="
          margin-bottom: 8px;
          color: #b89a5b;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        "
      >
        Profil candidat
      </div>


      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >

        ${renderInfoRow(
          "Prénom",
          safeFirstname
        )}

        ${renderInfoRow(
          "Nom",
          safeLastname
        )}

        ${renderInfoRow(
          "E-mail",
          `
            <a
              href="mailto:${safeEmail}"
              style="
                color: #315f9d;
                text-decoration: none;
              "
            >
              ${safeEmail}
            </a>
          `
        )}

        ${renderInfoRow(
          "Téléphone",
          safePhone
        )}

      </table>

    </div>


    <!-- POSTE -->

    <div
      style="
        margin-top: 36px;
      "
    >

      <div
        style="
          margin-bottom: 12px;
          color: #b89a5b;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        "
      >
        Recherche
      </div>


      <div
        style="
          padding:
            22px
            26px;
          background-color: #f7f5f1;
          border-left: 3px solid #315f9d;
        "
      >

        <div
          style="
            margin-bottom: 6px;
            color: #777777;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          "
        >
          Poste recherché
        </div>


        <div
          style="
            color: #0d2342;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 21px;
            line-height: 1.4;
          "
        >
          ${safePosition}
        </div>

      </div>

    </div>


    <!-- CV -->

    <div
      style="
        margin-top: 24px;
        padding:
          18px
          22px;
        background-color: #fafafa;
        border: 1px solid #ececec;
      "
    >

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >

        <tr>

          <td
            style="
              color: #777777;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
            "
          >
            Curriculum vitæ en, en pièce jointe
          </td>


          <td
            align="right"
            style="
              color: ${
                cv
                  ? "#315f9d"
                  : "#999999"
              };
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              font-weight: 700;
            "
          >
            ${
              cv
                ? `✓ ${escapeHtml(
                    cv.originalname
                  )}`
                : "Non fourni"
            }
          </td>

        </tr>

      </table>

    </div>
  `;


  const html =
    renderEmailLayout({

      eyebrow:
        "Nouvelle candidature · Espace candidats",

      title:
        `${safeFirstname} ${safeLastname}`,

      subtitle:
        "Une nouvelle candidature vient d’être transmise depuis le site Stellenbosch Conseil.",

      content,

      replyEmail:
        safeEmail,

      replyLabel:
        `Contacter ${safeFirstname}`,
    });


  const { data, error } =
    await resend.emails.send({

      from,

      to: [to],

      replyTo: email,

      subject:
        `Nouvelle candidature — ${firstname} ${lastname}`,

      html,

      text: `
STELLENBOSCH CONSEIL
Nouvelle candidature

Prénom : ${firstname}
Nom : ${lastname}
E-mail : ${email}
Téléphone : ${phone || "Non renseigné"}

POSTE RECHERCHÉ
--------------------------------

${position}

--------------------------------

CV :
${cv ? cv.originalname : "Aucun CV fourni"}

Vous pouvez répondre directement à cet e-mail pour contacter ${firstname} ${lastname}.
      `.trim(),

      attachments,

    });


  if (error) {
    console.error(
      "Erreur Resend :",
      error
    );

    throw new Error(
      error.message ||
      "Impossible d'envoyer l'e-mail."
    );
  }


  return data;
}