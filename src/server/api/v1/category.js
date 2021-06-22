/***
**** (proj_root)/src/server/api/v1/category.js
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

/***
 * /mode/:mode *
***/
router.get( "/mode/:mode" , (req, res) => {

  const   mode      =   parseInt( req.params.mode );
  let     results = {};

  (async () => {
    try	{
      let     sql_base	    = 'SELECT * FROM mst_category ';
      let     search_option = [];

      switch( mode ) {
				case	1:	//自分自身で受講登録ができるカテゴリが設定されたトレーニングを見るためのもの
					sql_base				=	sql_base + 'WHERE is_manager_entry = ? ';
					search_option.push( 0 );
					break;

				case	2:	//マネージャの取得登録が必要なカテゴリが設定されたトレーニングを見るためのもの
					sql_base				=	sql_base + 'WHERE is_manager_entry = ? ';
					search_option.push( 1 );
					break;

				default:		// 0を含むその他は全件表示
					//フィルタ追加なし
					break;
			}

      sql_base	= sql_base + 'ORDER BY category_id ASC';
			const	sql =	mysql.format( sql_base , search_option );

			console.log( `category/mode[${mode}] -> SQL[${sql}]` );		
			mycon = await pool.getConnection();
			const [rows1] = await mycon.execute( sql );

      results = {
        result: 'SUCCESS',
        data: rows1
      };
		}
		catch(e) {
      results = {
        result: 'ERROR',
        data: [{  category_id:			null,
                  category_name:		null,
              }]
      };
			console.log(e);
		}

    mycon.release();
    res.json( results );
	})();
});

module.exports = router; //エクスポートして公開
