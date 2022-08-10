// permet d'éviter le signe dollars dans le contenue transmis à la base de donnée.
module.exports = (req, res, next) => {
    let sauceObject;
    if(req.method == "POST"){
        sauceObject = JSON.parse(req.body.sauce);
    } else {
        sauceObject = req.body;
    }

    let newName = sauceObject.name.split("$").join('');
    let newManufacturer = sauceObject.manufacturer.split("$").join('');
    let newDescription = sauceObject.description.split("$").join('');
    let newIngredient = sauceObject.mainPepper.split("$").join('');

    let sauce = {
        "name" : newName,
        "manufacturer" : newManufacturer,
        "description" : newDescription,
        "mainPepper" : newIngredient,
        "heat" : sauceObject.heat,
        "userId" : sauceObject.userId   
    }
    
    if(req.method == "POST"){
        req.body.sauce = JSON.stringify(sauce);
    } else {
        req.body = sauce;
    }
    next();
}