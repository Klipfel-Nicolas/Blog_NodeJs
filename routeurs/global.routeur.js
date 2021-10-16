// Recuperer le module express
const express = require("express");
const routeur = express.Router()
const twig = require("twig")//On recupère le module Twig

//fonction permetant de traiter la demande client reçu 
//(les routes)
routeur.get("/", (requete, reponse) => {
    reponse.render("accueil.html.twig")
})

/**
 * Error 404
 */
routeur.use((requete, reponse, suite) => {
    const error = new Error("Page non trouvée")
    error.status = 404;
    suite(error); //envoi à la route ci-desous avec "error" générée
})
//La suite
//Gère toutes les erreurs
routeur.use((error, requete, reponse) =>{
    reponse.status(error.status || 500)
    reponse.end(error.message);
})

module.exports = routeur;