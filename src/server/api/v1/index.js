/***
**** (proj_root)/src/server/api/v1/index.js
***/

const express               = require('express');
const router                = express.Router();                 //ミドルウェアの準備
const employee              = require( './employee' );          //employee関連のAPIへのミドルウエア設定
const category              = require( './category' );          //category関連のAPIへのミドルウエア設定
const class_                = require( './class' );             //class関連のAPIへのミドルウエア設定
const trainingEmployee      = require( './trainingemployee' );  //QualificationTrainingEmployee関連のAPIへのミドルウエア設定


router.use( '/employee',              employee );             //employee系APIへのルーティング
router.use( '/category',              category );             //category系APIへのルーティング
router.use( '/class',                 class_ );               //class系APIへのルーティング
router.use( '/trainingemployee',      trainingEmployee );     //QualificationTrainingEmployee系APIへのルーティング
 
module.exports = router; //エクスポートして公開
