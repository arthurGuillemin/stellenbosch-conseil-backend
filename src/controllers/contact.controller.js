import {
  sendClientEmail,
  sendCandidateEmail,
} from "../services/email.service.js";


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================
   CLIENT
========================= */

export async function submitClientRequest(req, res) {
  try {
    const {
      name,
      company = "",
      email,
      phone = "",
      request,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le nom est obligatoire.",
      });
    }

    if (!email?.trim() || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Adresse e-mail invalide.",
      });
    }

    if (!request?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Votre besoin est obligatoire.",
      });
    }


    /*
     * LOG LOCAL
     *
     * On évite volontairement de logguer
     * les informations personnelles en production.
     */
    if (process.env.NODE_ENV !== "production") {

      console.log({
        name,
        company,
        email,
        phone,
        request,
      });
    }


    const result = await sendClientEmail({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      request: request.trim(),
    });


    console.log(
      ` E-mail client envoyé${result?.id ? ` — ${result.id}` : ""}`
    );


    return res.status(200).json({
      success: true,
      message: "Votre demande a bien été envoyée.",
    });

  } catch (error) {
    console.error(
      " Erreur demande client :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de l'envoi.",
    });
  }
}


/* =========================
   CANDIDAT
========================= */

export async function submitCandidateApplication(req, res) {
  try {
    const {
      firstname,
      lastname,
      email,
      phone = "",
      position,
    } = req.body;

    if (!firstname?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le prénom est obligatoire.",
      });
    }

    if (!lastname?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le nom est obligatoire.",
      });
    }

    if (!email?.trim() || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Adresse e-mail invalide.",
      });
    }

    if (!position?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le poste recherché est obligatoire.",
      });
    }


    if (process.env.NODE_ENV !== "production") {
      console.log("\n==============================");
      console.log("NOUVELLE CANDIDATURE");
      console.log("==============================");

      console.log({
        firstname,
        lastname,
        email,
        phone,
        position,

        cv: req.file
          ? {
              filename: req.file.originalname,
              mimetype: req.file.mimetype,
              size: `${Math.round(req.file.size / 1024)} Ko`,
            }
          : null,
      });
    }


    const result = await sendCandidateEmail({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      position: position.trim(),
      cv: req.file,
    });


    console.log(
      `Candidature envoyée${result?.id ? ` — ${result.id}` : ""}`
    );


    return res.status(200).json({
      success: true,
      message: "Votre candidature a bien été envoyée.",
    });

  } catch (error) {
    console.error(
      "Erreur candidature :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Une erreur est survenue lors de l'envoi.",
    });
  }
}