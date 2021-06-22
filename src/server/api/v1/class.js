/***
**** (proj_root)/src/server/api/v1/class.js
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

//ルーティング
router.get( "/all" , (req, res) => {

  let results = {};

  (async () => {
		try	{
			const sql_base	= 'SELECT * FROM ?? ORDER BY ?? ASC';
			const	d					= [ 'mst_class' , 'class_id' ];
			const	sql				=	mysql.format( sql_base , d );

			console.log( 'class/all -> SQL[' + sql + ']' );		
			mycon = await pool.getConnection();
			const [rows1, fields] = await mycon.execute( sql );

      results = {
        result: 'SUCCESS',
        data: rows1
      };
		}
		catch(e) {
      results = {
        result: 'ERROR',
        data: [{  class_id:			null,
                  class_name:		null,
              }]
      };
			console.log(e);
		}

    mycon.release();
    res.json( results );
	})();
});


module.exports = router; //エクスポートして公開
