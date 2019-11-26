const jwt = require('jsonwebtoken');

//=====================
// Verificar Token
//=====================

let verificaToken = (req, res, next) => {

 let token = req.get('token');
 
 jwt.verify(token, process.env.SEED, (err, decoded) => {

     if(err){
        return res.status(401).json({
        
         ok: false,
         err
        
        })
     } 

     req.usuario = decoded.usuario;
     next()
 });
 

 

};

//=====================
// Verificar ADMIN_ROLE
//=====================

let verificaADMIN_ROLE = (req, res, next) => {

  let role = req.usuario.role;
   //console.log(role);

    if(role === 'ADMIN_ROLE'){

     next();

    }else{

       return res.status(400).json({
        
        ok:false,
        mensaje: 'Debe ser administrador'
       
       });
    
    }
  
}


module.exports = {
 verificaToken,
 verificaADMIN_ROLE
}