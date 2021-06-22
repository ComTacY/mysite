/***
**** (proj_root)/src/server.js
***/

const config  = require('config');
const path    = require('path');
const express = require('express');
const cors    = require('cors');
const app     = express();
const midway  = require('./lib/midway');
const api     = require('./api/v1/index');


//config file参照する
let port_no = config.env.server.port;

//ミドルウェア設定
app.use( cors( { origin: true, credentials: true} ) );    //BrowsでのAPI使用のため
app.use( express.urlencoded( {extended: false} ));        //パーセントエンコーディング無し
app.use( express.json() );                                //パース用ミドルウェアを設定  express.json() = {Function: jsonParser}
app.use( express.static( path.resolve('./', 'dist') ) );  //Client下をユーザに共有するためのミドルウェア


/*  Midwayチェック入れます */
app.use( midway( {
                  defaultUser : 'komuroy' ,
                  strictClientVerify : 'SUCCESS'
                } ) );

//APIへルーティング
app.use( '/api/v1', api );                                //employee系APIへのルーティング

//画面系へルーティング
app.get( "*" , (req, res) => {
  res.sendFile( path.resolve('./', 'dist', 'index.html') );
});

//待受
app.listen( port_no , (results, error) => {
  console.log( 'Waiting for client connection PORT[' + port_no + ']' );  
});
