const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
let rolesValidos = {
 values: ['ADMIN_ROLE','USER_ROLE'],
 message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
 nombre: {

  type: String,
  required: [true, 'El nombre es necesario']
 
 },
 email: {

  type: String,
  required: [true, 'El correo es necesario'],
  unique: true,
 
 },
 password: {

  type: String,
  required: [true, 'La contraseña es obligatoria']

 },
 img: {

  type: String,
  required: false

 }, //no es obligatoria
 role: {
  
  default: 'USER_ROLE',
  type: String,
  enum: rolesValidos

 }, 
 estado: {

  default: true,
  type: Boolean

 },//boolean,
 google: {

  type: Boolean,
  default: false

 } 
});

usuarioSchema.methods.toJSON = function() {
 let user = this;
 let userObject = user.toObject();
 delete userObject.password;
 return userObject;
}
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Usuario', usuarioSchema);
