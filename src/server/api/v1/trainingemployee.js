/***
**** (proj_root)/src/server/api/v1/trainingemployee.js
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
** 教育・トレーニング・従業員情報取得
*/
router.post( "/login/" , (req, res) => {

	const	login_id		= req.body.searchLogin;
	const	category_id	= req.body.searchCategory;
	const	class_id		= req.body.searchClass;
	const	attend			= req.body.searchAttend;
	const	mode				=	req.body.searchEntryMode;
	let		results			= {};

	console.log( `trainingemployee [POST] searchLogin[${login_id}] searchCategory[${category_id}] searchClass[${class_id}] searchAttend[${attend}] searchEntryMode[${mode}]` );


	(async () => {
		let		response_obj	=	[];

		try	{

			let sql_base				= 'SELECT * FROM view_qualification_training_employee WHERE login_id = ? ';
			let	search_option		=	[ login_id ];
			const	pattern				= /^[0-9]{1}/;

			switch( mode ) {
				case	1:	//自分自身で受講登録ができるカテゴリが設定されたトレーニングを見るためのもの
					sql_base				=	sql_base + 'AND is_manager_entry = ? ';
					search_option.push( 0 );
					break;

				case	2:	//マネージャの取得登録が必要なカテゴリが設定されたトレーニングを見るためのもの
					sql_base				=	sql_base + 'AND is_manager_entry = ? ';
					search_option.push( 1 );
					break;

				default:		// 0を含むその他は全件表示
					//フィルタ追加なし
					break;
			} 

			if( (pattern.test(category_id)) && (category_id != '0') ) {
				sql_base					= sql_base + 'AND category_id = ? ';
				search_option.push( parseInt(category_id) );
			} 
			if( (pattern.test(class_id)) && (class_id != '0') ) {
				sql_base					= sql_base + 'AND class_id = ? ';
				search_option.push( parseInt(class_id) );
			} 
			switch( attend ){
				case	'1':	//受講済み
							sql_base					=	sql_base	+ 'AND ( (attended_on is not null) AND (DATE_FORMAT(expiration_on, \'%Y-%m-%d\') > DATE_FORMAT(now(), \'%Y-%m-%d\')) ) ';
							break;

				case	'2':	//未受講
							sql_base					=	sql_base	+	'AND ( (attended_on is null) OR ( (attended_on is not null) AND (DATE_FORMAT(expiration_on, \'%Y-%m-%d\') < DATE_FORMAT(now(), \'%Y-%m-%d\') ) ) )'
																						+	'AND ( DATE_FORMAT(deadline_on, \'%Y-%m-%d\') >= DATE_FORMAT(now(), \'%Y-%m-%d\') ) ';
							break;

				case	'3':	//期限切
							sql_base					=	sql_base	+	'AND ( (attended_on is null) OR ( (attended_on is not null) AND (DATE_FORMAT(expiration_on, \'%Y-%m-%d\') < DATE_FORMAT(now(), \'%Y-%m-%d\') ) ) )'
																						+	'AND ( DATE_FORMAT(deadline_on, \'%Y-%m-%d\') < DATE_FORMAT(now(), \'%Y-%m-%d\') ) ';
							break;

				case	'4':	//対象外
							sql_base					=	sql_base	+	'AND ( is_needed_attendance != 1 ) ';
							break;
			}

			sql_base	=	sql_base +	'ORDER BY login_id ASC, qualification_training_id ASC, qualification_training_employee_id ASC';

			let	sql							=	mysql.format( sql_base , search_option );
			let	tremp_recs			=	0;
			
			console.log( `/login/ -> SQL1[${sql}]` );

			mycon								= await pool.getConnection();
			const [rows1] 			= await mycon.execute( sql );
			tremp_recs					= rows1.length;

			console.log( `/login/ -> length:[${tremp_recs}]` );

			for( let i=0; i<tremp_recs; i++ )
			{
				let		qualification_training_employee_id = rows1[i].qualification_training_employee_id;

				sql_base	= 	'SELECT '
										+		'* '
										+	'FROM '
										+		'view_qualification_training_employee_site '
										+	'WHERE '
										+		'qualification_training_employee_id = ? '
										+	'ORDER BY '
										+		'qualification_training_employee_id ASC, '
										+		'site_id ASC, '
										+		'qualification_training_employee_site_id ASC';
				d					= [ qualification_training_employee_id ];
				sql				=	mysql.format( sql_base , d );

				const [rows2]		= await mycon.execute( sql );
				trempsite_recs	= rows2.length;
	
				console.log( `/employee/:employee_id -> SQL2[${sql}] -> length:[${trempsite_recs}]` );

				response_obj.push(	{
															header: rows1[i],
															body:		rows2
														} );
			}

			//データセット
			results = {
				result: 'SUCCESS',
				data: response_obj
			}
		}
		catch(e) {
			console.log(e);

			//データセット
			results ={
				result: 'ERROR',
				data: []
			}
		}

		/* 接続解消 */
		mycon.release();

		/* 応答 */
		res.json( results );
  } )();
});


module.exports = router; //エクスポートして公開
