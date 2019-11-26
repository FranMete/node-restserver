const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const _ = require('underscore');
const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');


app.get('/usuario', verificaToken, function (req, res) {

   let desde = req.query.desde || 0;
   desde = Number(desde);
   let rango = req.query.rango || 5;
   rango = Number(rango)
 Usuario.find({estado: true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(rango)       
        .exec( (err, usuarios) => {

               if(err || !usuarios) {

                  return res.status(400).json({
               
                     ok: false,
                     mensaje: 'Error obteniendo usuarios',
                     error: ((usuarios) =>{  if( !usuarios ){ return 'no existen usuarios' }else{ return err} })()
                  
                  });

               }

               Usuario.countDocuments({estado: true}, (err, conteo) => {

                  res.status(200).json({
               
                     ok: true,
                     usuarios,
                     cuantos: conteo

                  });

               });

         });

});

app.post('/usuario', [verificaToken,verificaADMIN_ROLE], function (req, res) {

 let body = req.body;

 let usuario = new Usuario({

    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role

  });

  usuario.save((err, usuarioDB) => {

    if(err) {
         
      return res.status(400).json({
       
         ok: false,
         mensaje: 'Error salvando usuario',
         error: err
       
        });

      }
      usuarioDB.password = null;
      res.json({

         ok: true,
         usuario: usuarioDB

     });
  
   });

 
});
app.put('/usuario/:id', verificaToken, function (req, res) {

   let id = req.params.id;
   let body = _.pick(req.body,['nombre','email','img','role','estado']);
   //console.log(body)
   Usuario.findByIdAndUpdate( id, body, {new: true, runValidators:true},(err, usuarioDB) => {
    
         if(err || !usuarioDB) {

            return res.status(400).json({
         
               ok: false,
               mensaje: 'Error salvando usuario',
               error: ((usuarioDB) =>{  if( !usuarioDB ){ return 'no existe usuario' }else{ return err} })()
            
            });

         }

         res.status(200).json({
            ok: true,
            usuario: usuarioDB
         }
)     

   });

});

app.delete('/usuario/:id', [verificaToken,verificaADMIN_ROLE],function (req, res) {
    
   let id = req.params.id;
   Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, borrado) => {

         if(err || !borrado) {

            return res.status(400).json({
         
               ok: false,
               mensaje: 'Error borrando usuario',
               error: ((borrado) =>{  if( !borrado ){ return 'El usuario no existe' }else{ return err} })()
            
            });

         }

         res.json({

            ok: true,
            usuario: borrado

         });



   });
 

});

module.exports = app;