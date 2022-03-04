// Import SauceModel
const Sauce = require('../Models/Sauce');
const fs = require('fs');

/// Create a Sauce
exports.createSauce = (req , res , next) =>{
   
        const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }:{...req.body}
      
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject
        });
        sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce cree avec succes'}))
        .catch( error => res.status(400).json({ error }));
    
};

/// Get All Sauces
exports.getAllSauces = (req , res , next) =>{
    Sauce.find()
    .then(sauces => res.status(201).json(sauces))
    .catch( error => res.status(400).json({ error }));
};

/// Get One sauce
exports.getOneSauce = (req , res , next) =>{
    Sauce.findOne({ _id:req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch( error => res.status(400).json({ error }));
}

/// Modify Sauce
exports.modifySauce = (req , res , next)=>{
    Sauce.findOne({_id:req.params.id})
    .then(sauce =>{ 
        if(req.file){
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}` , () =>{

                const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                }:{...req.body};
                Sauce.updateOne({_id:req.params.id} , { ...sauceObject , _id:req.params.id})
                .then(() =>res.status(200).json({ message : " Sauce Modifie avec succes "}))
                .catch( error => res.status(400).json({ error }));
    
            })
        }else{
            const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }:{...req.body};
            Sauce.updateOne({_id:req.params.id} , { ...sauceObject , _id:req.params.id})
            .then(() =>res.status(200).json({ message : " Sauce Modifie avec succes "}))
            .catch( error => res.status(400).json({ error }));
        }
       
    })
    .catch( error => res.status(500).json({ error }));
};

/// Delete Sauce 
exports.deleteSauce = (req , res , next)=>{
    Sauce.findOne({_id:req.params.id})
    .then(sauce =>{
        if(!sauce){
            return res.status(404).json({ error: new Error('Sauce non trouve !')});
        }
        if(sauce.userId !== req.auth.userId){
            return res.status(400).json({ error: new Error('Requete non autorise !')}); 
        }

        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}` , ()=> {
            sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({ message: "Sauce supprime !"}))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch( error => res.status(500).json({ error }));
}

/// Like or dislike sauce
exports.like_dislikeSauce = (req , res , next) =>{
    Sauce.findOne({_id:req.params.id})
    .then(sauce =>{
        if(req.body.like === 1){
            sauce.likes +=1;
            sauce.usersLiked.push(req.auth.userId);
            let index_dislike = sauce.usersDisliked.indexOf(req.auth.userId);
            if(index_dislike >=0){
                sauce.usersDisliked.splice(index_dislike , 1);
                sauce.dislikes -=1;
            }
        }

        if(req.body.like === -1){
            sauce.dislikes +=1;
            sauce.usersDisliked.push(req.auth.userId);
            let index_like = sauce.usersLiked.indexOf(req.auth.userId);
            if(index_like >=0){
                sauce.usersLiked.splice(index_like , 1);
                sauce.likes -=1;
            }
        }

        if(req.body.like === 0){
            let index_like = sauce.usersLiked.indexOf(req.auth.userId);
            let index_dislike = sauce.usersDisliked.indexOf(req.auth.userId);
            if(index_like >=0){
                sauce.usersLiked.splice(index_like , 1);
                sauce.likes -=1;
            }
            if(index_dislike >=0){
                sauce.usersDisliked.splice(index_dislike , 1);
                sauce.dislikes -=1;
            }
        }
        Sauce.updateOne({_id:req.params.id} , sauce)
        .then( () =>res.status(200).json({ message:"User Liked or Disliked"}))
        .catch( error => res.status(400).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
}
