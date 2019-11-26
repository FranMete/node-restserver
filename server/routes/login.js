const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken');





app.post('/login', (req,res) => {

 let body = req.body;
    
 Usuario.findOne({email: body.email}, (err, usuarioDB) => {
                           
        if(err || !usuarioDB) {

         return res.status(500).json({

            ok: false,
            mensaje: 'Error borrando usuario',
            error: ((usuarioDB) =>{  if( !usuarioDB ){ return '(Usuario) o contraseña incorrectos' }else{ return err} })()
         
         });

         }

       if(!bcrypt.compareSync( body.password, usuarioDB.password)){

        return res.status(400).json({
         ok: false,
         err: 'contraseña incorrecta'

        });
       
       }
       let token = jwt.sign({
        usuario: usuarioDB
       },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

       res.json({
       
        ok: true,
        usuario: usuarioDB,
        token
       
       })

 });

});



//===============
//login GOOGLE
//===============


async function verify(token) {
   // console.log(token)
     const ticket = await client.verifyIdToken({
     
     idToken: token,
     audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
     // Or, if multiple clients access the backend:
     //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
 
     });
 // console.log(ticket)
 const payload = ticket.getPayload();
 //console.log(payload)
     return {

      nombre: payload.name,
      email: payload.email,
      img: payload.picture,
      google: true
     
     }
}




app.post('/login/google', async (req,res) => {

   let token = req.body.idtoken;

   verify(token)
      .then( async respuesta => {
       try {
            console.log('respuesta')
           let usuarioDB = await Usuario.findOne({email: respuesta.email});
           console.log(usuarioDB)
           if(usuarioDB){  
             
                    if(usuarioDB.google === false){

                          return res.status(400).json({
                            
                           ok: false,
                           mensaje: 'Debe usar su autenticación normal',
                          
                         
                          });
                   
                     }else{

                          let token = jwt.sign({
                           usuario: usuarioDB, 
                          }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                          return res.json({

                           ok: true,
                           usuario: usuarioDB,
                           token

                          });
                    
                      }
            }else{
               //si el usuario no existe en la base de datos

               let usuario = new Usuario();

               usuario.nombre = respuesta.nombre;
               usuario.email = respuesta.email;
               usuario.img = respuesta.img;
               usuario.google = true;
               usuario.password = ':)';
        
                try {
             
                      let usuarioDB2 = await usuario.save();
                         
                           let token = jwt.sign({
                            usuario: usuarioDB2, 
                           }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                           return res.json({

                            ok: true,
                            usuario: usuarioDB2,
                            token

                           });


                } catch(error) {
                       console.log(error)
                     return res.status(500).json({
                         
                      ok: false,
                      mensaje: 'Error del servidor guardando usuario para autenticar',
                      error: error
                 
                      });
       
                  }

           }

       }catch(error) {
           console.log(error)
             return res.status(500).json({
            
                  ok: false,
                  mensaje: 'Error buscando usuario para autenticarLL',
                  error: error
                
             });
          }
                                   
      })
      .catch ( (error) =>  { console.log(error) 
       return res.status(403).json({ok: false,error})} );          
         

 });
 

module.exports = app;