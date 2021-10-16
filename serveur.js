
const express = require("express");// Recuperer le module express
const server = express();//crée le serveur express
const morgan = require("morgan")//recupère le module morgan (plus de log)
const routeurLivres = require("./routeurs/livres.routeur")//On recupère le routeur
const routeurAuteurs = require("./routeurs/auteurs.routeur")//On recupère le routeur
const routeurGlobal = require("./routeurs/global.routeur")//On recupère le routeur
const mongoose = require("mongoose")
const bodyParser = require("body-parser")// Module qui permet de traiter donné recupèrer par formulaire
const session = require("express-session")

//Conection à la base de donnée
mongoose.connect("mongodb://localhost/biblio", { useNewUrlParser:true, useUnifiedTopology:true });

//SESSION: pour utiliser des variable de session
server.set('trust proxy', 1) // trust first proxy
server.use(session({
    secret: 'keybord cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}))

//bascule le message dans la réponse
//Permet de suprimer le message FLASH
//A mettre avant le routeur (server.use("/", routeur))
server.use((requete, reponse, next)=>{
    reponse.locals.message = requete.session.message;
    delete requete.session.message;
    next();
});

server.use(express.static("public"))//Pour definir le dossier servant a l'envoi de fichier au client
server.use(morgan("dev"))
server.use(bodyParser.urlencoded({extended: false}))

server.use("/livres", routeurLivres)//On indique on server d'utiliser routeur pour les routes
server.use("/auteurs", routeurAuteurs)
server.use("/", routeurGlobal)

//indique sur quel port le serveur écoute
server.listen(3000);





