const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)
.is().max(30)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.has().not().symbols()
.is().not().oneOf(['Azerty123']);

exports.passwordSchema = passwordSchema;