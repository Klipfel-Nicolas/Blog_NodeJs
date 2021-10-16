const express = require("express");
const routeur = express.Router()
const twig = require("twig")//On recupère le module Twig

const autheurController = require("../contollers/auteur.controller")

routeur.get("/:id", autheurController.auteur_affichage)
routeur.get("/", autheurController.auteurs_affichage)
routeur.post("/", autheurController.auteur_ajout)
routeur.post("/delete/:id", autheurController.auteur_suppression)
routeur.get("/modification/:id", autheurController.auteur_modification)
routeur.post("/modificationServer", autheurController.auteur_modification_validation)

module.exports = routeur;