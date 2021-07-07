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

	console.log( `trainingemployee/login/ [POST] searchLogin[${login_id}] searchCategory[${category_id}] searchClass[${class_id}] searchAttend[${attend}] searchEntryMode[${mode}]` );


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


/*
** 教育・トレーニング・従業員情報取得
*/
router.post( "/update/" , (req, res) => {

	const	training_employee_id	= req.body.qualification_training_employee_id;
	const	attended_on						= req.body.attended_on;	
	const	updated_by						= req.body.updated_by; 	
	let		results								= {};
	const today									= new Date();
	const now_date							= today.getFullYear() + "/" +  ('0' + (today.getMonth()+1)).slice(-2) + "/" + ('0' +today.getDate()).slice(-2); 
	const now_datetime					= today.getFullYear() + "/" +  ('0' + (today.getMonth()+1)).slice(-2) + "/" + ('0' +today.getDate()).slice(-2)+ " " + ('0' +today.getHours()).slice(-2) + ":" + ('0' +today.getMinutes()).slice(-2) + ":" + ('0' +today.getSeconds()).slice(-2); 

	console.log( `trainingemployee/update/ [POST] training_employee_id[${training_employee_id}] attended_on[${attended_on}] updated_by[${updated_by}] updated_at[${now_datetime}]` );

	(async () => {
		let		response_obj	=	[];

		try	{
			let sql_base				= 'SELECT * FROM view_qualification_training_employee WHERE qualification_training_employee_id = ? ';
			let	search_option		=	[ parseInt(training_employee_id) ];
			let	sql							=	mysql.format( sql_base , search_option );
			let	tremp_recs			=	0;
			
			console.log( `/update/ -> SQL1[${sql}]` );

			mycon								= await pool.getConnection();
			const [rows1] 			= await mycon.execute( sql );
			tremp_recs					= rows1.length;

			console.log( `SQL1[${sql}], 取得レコード数[${tremp_recs}]` );
			console.log( `data[0] 取得レコード[${rows1[0]}]` );

			if( tremp_recs > 0 ) {
				/* データが見つかった */

				const	has_expiration_day	=	rows1[0].has_expiration_day;
				let		expiration_str;
				let		deadline_str;

				if( has_expiration_day != 0 ) {
					//有効期限・取得期限設定
					const	expiration_days	=	rows1[0].expiration_days;

					//有効期限
					let	expiration_date		=	new Date( attended_on );
					expiration_date.setDate( expiration_date.getDate() + expiration_days - 1 );
					expiration_str				=	expiration_date.getFullYear() + "-" +  ('0' + (expiration_date.getMonth()+1)).slice(-2) + "-" + ('0' +expiration_date.getDate()).slice(-2);

					//受講期限
					let	deadline_date			= new Date( attended_on );
					deadline_date.setDate( deadline_date.getDate() + expiration_days );
					deadline_str					= deadline_date.getFullYear() + "-" +  ('0' + (deadline_date.getMonth()+1)).slice(-2) + "-" + ('0' +deadline_date.getDate()).slice(-2);				

				}
				else {
					//有効期限・取得期限なし
					expiration_str	=	null;
					deadline_str		=	null
				}

				//教育・トレーニング・従業員データレコード更新
				sql_base				= 						'UPDATE trans_qualification_training_employee ';
				sql_base				=	sql_base +	'SET attended_on = ?, expiration_on = ?, deadline_on = ?, is_reminder_sent_first = ?, is_reminder_sent_second = ?, ';
				sql_base				=	sql_base +	'updated_at = ?, updated_by = ? WHERE qualification_training_employee_id = ?';			
				update_option		=	[ attended_on, expiration_str, deadline_str, 0, 0, now_datetime, parseInt(updated_by), parseInt(training_employee_id) ];
				sql							=	mysql.format( sql_base , update_option );
				tremp_recs			=	0;
				
				console.log( `/update/ -> SQL1[${sql}]` );
	
				mycon								= await pool.getConnection();
				const [rows2] 			= await mycon.execute( sql );
				tremp_recs					= rows2.length;
	
				console.log( `/login/ -> length:[${tremp_recs}]` );

				//データセット
				results = {
					result: 'SUCCESS',
					data: response_obj
				}
			}
			else {
				/* データが見つからなかった */
				//データセット
				results = {
					result: 'ERROR',
					data: {}
				}
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
