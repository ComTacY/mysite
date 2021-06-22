/***
**** (proj_root)/src/server/api/v1/employee.js
***/

const config    = require('config');
const express   = require('express');
const router    = express.Router();
const mysql     = require('mysql2/promise');


const db_setting = { //DB接続パラメータ関連
	connectionLimit : config.env.db.connectionLimit,
	host:	config.env.db.host,
	user:	config.env.db.user,
	password:	config.env.db.password,
	database:	config.env.db.database,
  dateStrings: config.env.db.dateStrings,
	timezone: config.env.db.timezone
};

let	mycon = null;
let pool  = mysql.createPool( db_setting );

//////////////////////////////////
//ルーティング
//////////////////////////////////


/*
** ログインを取得する
*/
router.get( "/getemployee" , (req, res) => {

	let results = {};

	//Midway系からユーザを取得する
	const login_id = res.locals.user;
	
	(async () => {
		try	{
			//SQL準備
			let	sql_base	= 'SELECT employee_id, login_id, is_administrator FROM mst_employee WHERE login_id = ?';
			let	d					= [ login_id ];
			let	sql				=	mysql.format( sql_base , d );

			//Connection取得
			mycon					= await pool.getConnection();

			console.log( '/getemployee [1] -> SQL[' + sql + ']' );
			const	[rows1, fields1] = await mycon.execute( sql );

			//データ検証
			if( rows1.length > 0 ) {
				sql_base	= 'SELECT count(*) as ?? FROM ?? WHERE ?? = ?';
				d					= [ 'member_count' , 'mst_employee' , 'supervisor_employee_id' , rows1[0].employee_id ];
				sql				=	mysql.format( sql_base , d );
				mycon			= await pool.getConnection();

				console.log( '/getemployee [2] -> SQL[' + sql + ']' );
				const [rows2, fields2] = await mycon.execute( sql );	
	
				results ={
					result: 'SUCCESS',
					data: { employee_id:			rows1[0].employee_id,
					 				login_id:					rows1[0].login_id,
					 				is_administrator:	rows1[0].is_administrator ? true : false,
					 				is_manager:				rows2[0].member_count > 0 ? true : false
					 			}
				};
			}
			else {
				results ={
					result: 'ERROR',
					data: []
				};
			}
		}
		catch(e) {
			console.log(e);

			results ={
				result: 'ERROR',
				data: []
			}
		}

		//Connection開放
		mycon.release();

		//クライアント応答
		res.json( results );
	} )();
});


module.exports = router; //エクスポートして公開
