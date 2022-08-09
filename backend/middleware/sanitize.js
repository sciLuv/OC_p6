// permet d'éviter le signe dollars dans le contenue transmis à la base de donnée.
exports.sanitizeSauce = (sauce) => {
    let newName = sauce.name.split("$").join('');
    let newManufacturer = sauce.manufacturer.split("$").join('');
    let newDescription = sauce.description.split("$").join('');
    let newIngredient = sauce.mainPepper.split("$").join('');

    sauce.name = newName;
    sauce.manufacturer = newManufacturer;
    sauce.description = newDescription;
    sauce.mainPepper = newIngredient;  
    
    return sauce;
}

exports.sanitizeMail = (mail) => {
    /* name
    manufacturer
    description */
}


