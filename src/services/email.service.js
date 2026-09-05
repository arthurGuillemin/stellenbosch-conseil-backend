import "dotenv/config";

import { Resend } from "resend";

import { escapeHtml } from "../utils/escapeHtml.js";

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

  const safeName = escapeHtml(name);
  const safeCompany = escapeHtml(company || "Non renseignée");
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Non renseigné");

  const safeRequest = escapeHtml(request)
    .replace(/\r?\n/g, "<br />");

  const { data, error } = await resend.emails.send({
    from,

    to: [to],

    replyTo: email,

    subject: `Nouvelle demande client — ${name}`,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          color: #101010;
          line-height: 1.6;
        "
      >
        <h1 style="font-size: 22px;">
          Nouvelle demande client
        </h1>

        <hr />

        <p>
          <strong>Nom :</strong>
          ${safeName}
        </p>

        <p>
          <strong>Société :</strong>
          ${safeCompany}
        </p>

        <p>
          <strong>E-mail :</strong>
          ${safeEmail}
        </p>

        <p>
          <strong>Téléphone :</strong>
          ${safePhone}
        </p>

        <h2 style="font-size: 18px;">
          Besoin
        </h2>

        <p>
          ${safeRequest}
        </p>
      </div>
    `,

    text: `
Nouvelle demande client

Nom : ${name}
Société : ${company || "Non renseignée"}
E-mail : ${email}
Téléphone : ${phone || "Non renseigné"}

Besoin :
${request}
    `.trim(),
  });

  if (error) {
    console.error("Erreur Resend :", error);

    throw new Error(
      error.message || "Impossible d'envoyer l'e-mail."
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
  const resend = getResendClient();

  const { from, to } = getMailConfig();

  const safeFirstname = escapeHtml(firstname);
  const safeLastname = escapeHtml(lastname);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Non renseigné");
  const safePosition = escapeHtml(position);

  const attachments = [];

  if (cv) {
    const safeFilename = cv.originalname.replace(
      /[^\p{L}\p{N}._ -]/gu,
      "_"
    );

    attachments.push({
      filename: safeFilename,

      /*
       * Resend accepte le contenu du fichier encodé
       * pour l'envoyer en pièce jointe.
       */
      content: cv.buffer.toString("base64"),
    });
  }

  const { data, error } = await resend.emails.send({
    from,

    to: [to],

    replyTo: email,

    subject: `Nouvelle candidature — ${firstname} ${lastname}`,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
          color: #101010;
          line-height: 1.6;
        "
      >
        <h1 style="font-size: 22px;">
          Nouvelle candidature
        </h1>

        <hr />

        <p>
          <strong>Prénom :</strong>
          ${safeFirstname}
        </p>

        <p>
          <strong>Nom :</strong>
          ${safeLastname}
        </p>

        <p>
          <strong>E-mail :</strong>
          ${safeEmail}
        </p>

        <p>
          <strong>Téléphone :</strong>
          ${safePhone}
        </p>

        <p>
          <strong>Poste recherché :</strong>
          ${safePosition}
        </p>

        <p>
          <strong>CV :</strong>
          ${cv ? "joint à cet e-mail" : "aucun CV fourni"}
        </p>
      </div>
    `,

    text: `
Nouvelle candidature

Prénom : ${firstname}
Nom : ${lastname}
E-mail : ${email}
Téléphone : ${phone || "Non renseigné"}
Poste recherché : ${position}
CV : ${cv ? "joint à cet e-mail" : "aucun CV fourni"}
    `.trim(),

    attachments,
  });

  if (error) {
    console.error("Erreur Resend :", error);

    throw new Error(
      error.message || "Impossible d'envoyer l'e-mail."
    );
  }

  return data;
}