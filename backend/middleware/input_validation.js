const fs = require('fs');
const test_input =  /^[a-zA-Z_' -]+$/;
module.exports = (req , res , next) =>{

    let sauce = req.route.methods.put ? req.body : JSON.parse(req.body.sauce);
    if( req.route.methods.put && req.file)
        sauce = JSON.parse(sauce.sauce);

    if(req.file && req.file.size > 200000){
        fs.unlink(`images/${req.file.filename}`, ()=>{}); 
        return res.status(400).json({ message :"les fichiers des images est tres lourd !"});
    }

    if(!test_input.test(sauce.name) || !test_input.test(sauce.manufacturer) || !test_input.test(sauce.description) || !test_input.test(sauce.mainPepper)){
        if(req.file){
            fs.unlink(`images/${req.file.filename}`, ()=>{});
        }
        return res.status(400).json({ message :"Invalid value !"});
    }
       
    if(sauce.name.length < 3 || sauce.manufacturer.length < 3 || sauce.description.length < 3 || sauce.mainPepper.length < 3){
        if(req.file){
            fs.unlink(`images/${req.file.filename}`, ()=>{});
        }
        return res.status(400).json({ message :"does not have enough length"});
    }
    else{
        next();
    }
}