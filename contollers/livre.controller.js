const livreSchema = require("../models/livres.model");
const auteurSchema = require("../models/auteurs.model");
const mongoose = require("mongoose")
const fs = require("fs") //pour supprimer une image dans fichier (pas de npm install)


//List livres
exports.livres_affichage = (requete, reponse) => {
    auteurSchema.find()
    .exec()
    .then(auteurs => {
        livreSchema
            .find()
            .populate("auteur")
            .exec()
            .then(livres => {
            reponse.render("livres/liste.html.twig", {
                livres : livres,
                auteurs : auteurs,
                message: reponse.locals.message
            })
            })
            .catch(error => {
                console.log(error);
            })   
    })
    .catch(error => {
        console.log(error);
    })
}

//create livre
exports.livre_ajout = (requete, reponse) => {
    const livre = new livreSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.nom,
        auteur: requete.body.auteur,
        pages: requete.body.pages,
        description: requete.body.description,
        image: requete.file.path.substring(14) //supprimer ( /public/images/ ) du path
    })
    livre
        .save()
        .then(resultat => {
            reponse.redirect("/livres");
        })
        .catch(error =>{
            console.log(error);
        })
}

//Delete livre
exports.livre_suppression = (requete, reponse) => {
    let livre = livreSchema.findById(requete.params.id)
    .select("image")
    .exec()
    .then(livre => {
        fs.unlink(`./public/images/${livre.image}`, error => {
            console.log(error);
        })
        livreSchema
            .remove({ _id: requete.params.id })
            .exec()
            .then(resultat => {
                requete.session.message = {
                    type: 'success',
                    contenu: 'Supression effectuée'
                }
                reponse.redirect('/livres');
            })
            .catch(error => {
                console.log(error)
            }) 
    })
    .catch(error => {
        console.log(error)
    })
}

//Update livre get
exports.livre_modification = (requete, reponse) => {
    auteurSchema.find()
    .exec()
    .then(auteurs => {
        let livre = livreSchema.findById(requete.params.id)
            .populate("auteur")
            .exec()
            .then( livre => {
                reponse.render("livres/livre.html.twig", { 
                    livre: livre,
                    auteurs: auteurs,
                    isModification: true
                })
            })  
            .catch(error =>{
                console.log(error)
            }) 
    })
    .catch(error =>{
        console.log(error)
    }) 
    
}

//Update livre post (requete.body utilise bodyparser)
exports.livre_modification_validation = (requete, reponse) => {
    
    const livreUpdate = {
        nom: requete.body.nom,
        auteur: requete.body.auteur,
        pages: requete.body.pages,
        descritpion: requete.body.description,
    };
    
    livreSchema.updateOne({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat => {
        if(resultat.modifiedCount < 1) throw new Error("Requete de modification échouée");
        
        requete.session.message = {
            type: 'success',
            contenu: 'Modification effectuée'
        }
        reponse.redirect("/livres");
    })
    .catch(error => {
        requete.session.message = {
            type: 'danger',
            contenu: error.message
        }
        reponse.redirect("/livres");
    })
}

//Modifier image
exports.livre_modification_image = (requete, reponse) => {
    //supression de l'ancienne image
    let livre = livreSchema.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(livre => {
        fs.unlink(`./public/images/${livre.image}`, error => {
            console.log(error);
        })
    });
    //Modification de l'image 
    const livreUpdate = {
        image : requete.file.path.substring(14)
    }
    livreSchema.updateOne({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat => {
        reponse.redirect(`/livres/modification/${requete.body.identifiant}`)
    })
    .catch(error => {
        console.log(error)
    })
}

//Details d'un livre
exports.livre_affichage = (requete, reponse) => {
    livreSchema
        .findById(requete.params.id)
        .populate("auteur")
        .exec()
        .then( livre =>{
            reponse.render("livres/livre.html.twig", { 
                livre: livre,
                isModification: false
            })
        })  
        .catch(error =>{
            console.log(error)
        })
    
}