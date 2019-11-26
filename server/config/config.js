//=====================
//puerto
//=====================

process.env.PORT = process.env.PORT || 3000;



//==============
// entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============
// base de datos
//==============

let urlDB;
if(process.env.NODE_ENV === 'dev'){
 urlDB = 'mongodb://localhost:27017/cafe';
}else{
 urlDB = process.env.MONGO_URI;
 }

process.env.URLDB = urlDB;

//==================
// TOKEN JWT
//==================
 process.env.SEED = 'este-es-un-seed';
 process.env.CADUCIDAD_TOKEN = '2 days';

//=================
// GOOGLE CLIENT ID
//=================
process.env.CLIENT_ID = process.env.CLIENT_ID ||  '371363647997-v6pdsc87388iekpulj5srappra2308jg.apps.googleusercontent.com';