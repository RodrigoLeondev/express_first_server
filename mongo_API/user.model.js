const mongoose = require("mongoose")

// correo
//  password
// namr
const userSchema = new mongoose.Schema({
    email: {
        type: String,
    // a empezar con cualquier caracter ^.*
    // despues sigue @
    // lo que sea .*
    // quiero un punto \..
    // lo que sea .*
    // los / y / significa que es un Regex
        match: /^.*@.*\..*$/,
        required: true
    },
    pasword: {
        type: String,
        requiered: true,
        minlenght: 3,
    },
    name: {
        type: String,
        inlenght: 3,
    }
})

module.exports = mongoose.model("users", userSchema)