/***
**** (proj_root)/src/client/components/TrainingEmployeeTable.js
***/

import  React           from  "react";
import  i18n            from  "../locales/i18n";
import  Loading         from  "./loading";


class TrainingEmployeeTable extends React.Component {
  constructor( props ) {
    super( props );

    /* 親よりもらうデータ */
    this.mode                   = this.props.mode;
    this.target_login_id        = this.props.target_login_id;
    this.training_employee_data = this.props.training_employee_data;
    this.language               = this.props.language;
    this.setSelectedRow         = this.props.setSelectedRow;

    this.state = {
      //画面状態等
      isLoading:                    false,//ロード中はTrue
      checkedTrainingEmployeeId:    0,    //選択中TrainingEmployeeID
      checkedTrainingEmployeeName:  ''    //選択中TrainingEmployeeName
    };

    //ハンドルをバインド
    this.handleOnChange                     = this.handleOnChange.bind(this);
    this.handleOnClick                      = this.handleOnClick.bind( this );
    this.setSearchTrainingEmployeeSiteData  = this.props.setSearchTrainingEmployeeSiteData;

    /* ログ */
    console.log(  this.constructor.name + '.Constructor' );
  }

  /***
   * すべての表示が終わったらシステム予約関数 *
  ***/
  componentDidMount() {
  }

  /***
   * すべての状態更新終わったらシステム予約関数 *
  ***/
  componentDidUpdate() {
  }

  /***
   * 項目変更ハンドラ *
  ***/
  handleOnChange( event ) {
    const value             = event.target.value;
    const name              = event.target.name;
    const id_training_name  = "checkedTrainingEmployeeName_" + value; 
    const training_name     = document.getElementById( id_training_name ).innerHTML;
    let   json_training_employee_id;
    let   state_training_employee_id;

    this.setState(
      {
        checkedTrainingEmployeeId:    value,
        checkedTrainingEmployeeName:  training_name
      },
      () => {
        /* 親クラスのイベントを起動 */
        this.props.setSelectedRow( this.state.checkedTrainingEmployeeId , this.state.checkedTrainingEmployeeName );      

        /* サイト別情報テーブル表示を促す？？？ */
        for( let i=0; i<this.training_employee_data.length; i++ ) {

          json_training_employee_id   = parseInt( this.training_employee_data[i].header.qualification_training_id );
          state_training_employee_id  = parseInt( this.state.checkedTrainingEmployeeId );

          console.log( `選択 i[${i}] 受信データ[${this.training_employee_data[i].header.qualification_training_id}] 保存データ[${this.state.checkedTrainingEmployeeId}]` );

          if( json_training_employee_id === state_training_employee_id ) {
            //一致した
            console.log( `選択 i[${i}]` );
            this.setSearchTrainingEmployeeSiteData( this.training_employee_data[i].body );
            break;
          }
        }
      } 
    );
  }

  /***
   * ボタン押下ハンドラ *
  ***/
  handleOnClick( event ) {
    //ボタン押下
  }
  
  /***
   * 書き込み処理 *
  ***/
  render() {
    const target_login_id     = this.target_login_id;
    const mode                = this.mode;
    const json_search_result  = this.training_employee_data;
    let   table_title;
    let   column_title;

    switch( mode ) {

      case  1:  //  自分で受講登録する画面
            table_title   = "教育・トレーニング受講情報";
            column_title  = "教育・トレーニング名称";
            break;

      case  2:  //  Managerが受講登録する画面
            table_title   = "資格・特別教育取得情報";
            column_title  = "資格・特別教育名称";
            break;

      default:  //  資格・教育・トレーニング情報照会用
            table_title   = "資格・教育・トレーニング情報";
            column_title  = "資格・教育・トレーニング名称";
            break;
    }

    const render_jsx = (
      <table className="table table-bordered caption-top">
        <caption>{table_title} - {target_login_id}</caption>
        <thead className="table-dark">
          <tr className="bg-secondary">
            <th scope="col">チェック</th>
            <th scope="col">#</th>
            <th scope="col">{column_title}</th>
            <th scope="col">カテゴリ</th>
            <th scope="col">区分</th>
            <th scope="col">サイト別</th>
            <th scope="col">受講日</th>
            <th scope="col">有効期限</th>
            <th scope="col">受講期限</th>
            <th scope="col">期限</th>
          </tr>
        </thead>
        <tbody>
          {
            json_search_result.map( (searchItem, index) => {

              const today     = new Date();
              const str_today = today.getFullYear() + "-" +  ('0' + (today.getMonth()+1)).slice(-2) + "-" + ('0' +today.getDate()).slice(-2); 
              
              const training_id       = String( searchItem.header.qualification_training_id );
              const training_name     = searchItem.header.qualification_training_name;
              const category_name     = searchItem.header.category_name;
              const class_name        = searchItem.header.class_name;
              const is_site_separeted = searchItem.header.is_site_separeted;
              const is_remind_first   = searchItem.header.is_reminder_sent_first;
              const attended_on       = searchItem.header.attended_on;
              const expiration_on     = searchItem.header.expiration_on;
              const deadline_on       = searchItem.header.deadline_on;
              const expiration_days   = searchItem.header.expiration_days;

              let   color;
              const number                  = index + 1;
              const id_tr_emp_checkbox      = "checkedTrainingEmployeeId_"   + training_id;
              const id_check_training_name  = "checkedTrainingEmployeeName_" + training_id;

              /* 背景・文字色作成 */
              if( ( (attended_on === null) || ( (attended_on !== null) && (expiration_on < str_today) ) ) && (deadline_on < str_today) ) {
                //期限切れ
                color   = 'bg-danger text-white';       //背景: 赤 文字: 白
              }
              else {
                if( ( (attended_on === null) || ( (attended_on !== null) && (expiration_on < str_today) ) ) && (deadline_on >= str_today) ) {
                  if( is_remind_first === 1 ) {
                    //リマインド超過考慮
                    color   = 'bg-warning text-danger'; //背景: 黄 文字: 赤
                  }
                  else {
                    //未受講
                    color   = 'bg-warning text-body';   //背景: 黄 文字: 黒
                  }
                }
                else {
                  //全く問題なし
                  color   = 'bg-light text-body';       //背景: 白 文字: 黒
                }
              }

              return (
                <tr key={training_id} className={color}>
                  <td scope="col">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" id={id_tr_emp_checkbox} name="checkedTrainingEmployeeId" value={training_id} stored={training_name} checked={this.state.checkedTrainingEmployeeId === String(training_id)} onChange={ this.handleOnChange} />
                      <label className="form-check-label" htmlFor={id_tr_emp_checkbox}>
                      </label>
                    </div>
                  </td>
                  <td scope="col">{number}</td>
                  <td scope="col" id={id_check_training_name}>{training_name}</td>
                  <td scope="col">{category_name}</td>
                  <td scope="col">{class_name}</td>
                  <td scope="col">{is_site_separeted === 1 ? "◯" : "－"}</td>
                  <td scope="col">{attended_on}</td>
                  <td scope="col">{expiration_on}</td>
                  <td scope="col">{deadline_on}</td>
                  <td scope="col">{expiration_days}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>        
    );

    //読み込み中
    return( render_jsx );
  }
}

export default  TrainingEmployeeTable;
