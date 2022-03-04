/// importer bcrypt 
const bcrypt = require('bcrypt');

require('dotenv').config();
/// Importer crypto-js
const crypto_js = require('crypto-js');

/// Importer le modele User
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

/// Importer password-validation
const password_validator = require('../Validation/password_validation');
// Signup Users
exports.signup = (req , res , next) => {

    /// validite du mot de passe 
    let error = password_validator.validate(req.body.password , {details:true});
    if(error != null){
        for(i=0;error.length;i++){
            return res.status(401).json({ message: error[i].message });
        }
    }
 
    /// cryptage du mot de passse et de l'email
    let crypto_email = crypto_js.HmacSHA1(req.body.email , process.env.SECRET_KEY); 
    bcrypt.hash(req.body.password , 10)
    
    ///Enregistrement de 'email et du mot de passe
    .then(hash =>{
        const user = new User({
            email:crypto_email,
            password:hash
        });
        user.save()
        .then(() =>res.status(201).json({ message: " Utilisateur cree avec succes "}))
        .catch(() => res.status(400).json({ message: "User alredy exist !" }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req , res , next) =>{ 
    let crypto_email = crypto_js.HmacSHA1(req.body.email , process.env.SECRET_KEY);
    const user = new User({
        email:crypto_email,
    });
 
    User.findOne({ email: user.email})
    .then(user =>{
        if(!user){
            return res.status(401).json({ message:"Utilisateur non trouve !"});
        }
        bcrypt.compare(req.body.password , user.password) 
        
        .then(valid => {
            if(!valid){
                return res.status(401).json({ message: "Mot de passe incorrect !"});
            }
            res.status(200).json({
                userId:user._id,
                token:jwt.sign(
                    {userId:user._id},
                    process.env.SECRET_TOKEN,
                    { expiresIn:'24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch( error => res.status(500).json({ error }));
};