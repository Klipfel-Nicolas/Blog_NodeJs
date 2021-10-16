// Recuperer le module express
const express = require("express");
const routeur = express.Router()
const twig = require("twig")//On recupère le module Twig
const multer = require("multer")// Module pour upload d image

const livreController = require("../contollers/livre.controller")

//Upload d'image
const storage = multer.diskStorage({
    destination : (requete, file, cb) => {
        cb(null, "./public/images/")
    },
    filename : (requete, file, cb) => {
        let date = new Date().toDateString();
        cb(null, `${date}-${Math.round(Math.random() * 10000)}-${file.originalname}`)
    }
})
const fileFilter = (requete, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true)
    }else{
        cb(new Error("l'image n'est pas acceptée"), false)
    }
}

const upload = multer({
    storage : storage,
    limits : {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})




//Liste de livre
routeur.get("/", livreController.livres_affichage)

// Creation de livre
routeur.post("/", upload.single("image"),livreController.livre_ajout)

// Supression d'un livre
routeur.post("/delete/:id", livreController.livre_suppression)

// Modification
routeur.get("/modification/:id", livreController.livre_modification)
routeur.post("/modificationServer", livreController.livre_modification_validation)

//Modifier image
routeur.post("/updateImage", upload.single("image"), livreController.livre_modification_image)

//Details d'un livre
routeur.get("/:id", livreController.livre_affichage)


module.exports = routeur;