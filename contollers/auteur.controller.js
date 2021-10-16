const auteurSchema = require("../models/auteurs.model")
const livreSchema = require("../models/livres.model")
const mongoose = require("mongoose")
const fs = require("fs")

exports.auteur_affichage = (requete, reponse) => {
    auteurSchema.findById(requete.params.id)
        .populate('livres')
        .exec()
        .then(auteur =>{ 
            console.log(auteur);
            reponse.render("auteurs/auteur.html.twig", {
                auteur: auteur,
            }) 
        })
        .catch(error =>{
            console.log(error);
        })
        
}

exports.auteurs_affichage = (requete, reponse) => {
    auteurSchema.find()
    .populate('livres')
    .exec()
    .then( auteurs => {
        reponse.render("auteurs/liste.html.twig", {
            auteurs: auteurs,
        }) 
    })
}

exports.auteur_ajout = (requete, reponse) => {

    const auteur = new auteurSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.nom,
        prenom: requete.body.prenom,
        age: requete.body.age,
        sexe: requete.body.sexe,
    })
    auteur.save()
        .then(resultat => {
            reponse.redirect("/auteurs");
        })
        .catch(error =>{
            console.log(error);
        })
}

exports.auteur_suppression = (requete, reponse) => {
    //On recupere l'auteur anonyme pour le remplacer sur tout les livre ayant pour auteur celui qu'on supprime
    auteurSchema.find()
    .where("nom").equals("anonyme")
    .exec()
    .then(auteur => {
        //modifier livre ayant pour auteur celui qu on supprime
        livreSchema.updateMany({"auteur":requete.params.id},{"$set":{
            //auteur: auteur anonyme
            "auteur": auteur[0]._id
        }},
        {"multi": true}
        )
        .exec()
        .then(
            auteurSchema.remove({_id:requete.params.id})
            .where("nom").ne("anonyme") // Empeche de suprimer l'auteur anonyme (ne = not equals)
            .exec()
            .then(reponse.redirect("/auteurs"))
            .catch(error => {
                console.log(error);
            })
        )
    })
}

exports.auteur_modification = (requete, reponse) => {
    auteurSchema.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        reponse.render("auteurs/auteur.html.twig", {auteur: auteur, isModification:true});
    })
    .catch(error =>{
        console.log(error);
    })
}

exports.auteur_modification_validation = (requete, reponse) => {
    const auteurUpdate = {
        nom: requete.body.nom,
        prenom: requete.body.prenom,
        age: requete.body.age,
        sexe: (requete.body.sexe) ? true : false,
    };
    auteurSchema.updateOne({_id:requete.body.identifiant}, auteurUpdate)
    .exec()
    .then(resultat => {
        if(resultat.modifiedCount < 1) throw new Error("Requete de modification échouée");
        reponse.redirect("/auteurs");
    })
    .catch(error =>{
        console.log(error);
        reponse.redirect("/auteurs");
    })
}