const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    userId:{type: String , required:true},
    name:{ type:String , required:true},
    manufacturer:{type:String , required:true},
    description:{ type:String , required:true},
    mainPepper: { type:String , required:true},
    imageUrl: { type:String , required:true},
    heat: { type:Number},
    likes: {type:Number , default:0 , required:true },
    dislikes : {type:Number, default:0 , required:true},
    usersLiked: {type:[String]},
    usersDisliked:{type:[String] }

});

module.exports = mongoose.model('Sauce' , sauceSchema);

