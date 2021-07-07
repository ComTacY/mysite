/***
**** (proj_root)/src/client/components/TrainingEmployeeSiteTable.js
***/

import  React           from  "react";
import  i18n            from  "../locales/i18n";
import  Loading         from  "./loading";


class TrainingEmployeeSiteTable extends React.Component {
  constructor( props ) {
    super( props );

    /* 親よりもらうデータ */
    this.mode                         = this.props.mode;
    this.language                     = this.props.language;
    this.training_employee_site_data  = this.props.training_employee_site_data;

    this.state = {
      //画面状態等
      checkedTrainingEmployeeSiteId:    0,    //選択中TrainingEmployeeSiteID
      checkedTrainingEmployeeSiteName:  ''    //選択中TrainingEmployeeSiteName
    };

    //ハンドルをバインド
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick  = this.handleOnClick.bind( this );

    /* ログ */
    console.log(  this.constructor.name + `.Constructor data[${this.training_employee_site_data}]` );
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
    const id_training_name  = "checkedTrainingEmployeeSiteId_" + value; 
    const site_code         = document.getElementById( id_training_name ).innerHTML;
 
    this.setState(
      {
        checkedTrainingEmployeeSiteId:    value,
        checkedTrainingEmployeeSiteName:  site_code
      },
     () => {
        /* 親クラスのイベントを起動 */
      } 
    );
  }

  /***
   * ボタン押下ハンドラ *
  ***/
  handleOnClick( event ) {
  }
  
  /***
   * 書き込み処理 *
  ***/
  render() {
    const mode                = this.mode;
    const json_search_result  = this.training_employee_site_data;
    let   table_title;
    let   column_title;

    const render_jsx = (
      <table className="table table-bordered caption-top">
        <caption></caption>
        <thead className="table-dark">
          <tr className="bg-secondary">
            <th scope="col">チェック</th>
            <th scope="col">#</th>
            <th scope="col">サイト名</th>
            <th scope="col">受講日</th>
            <th scope="col">有効期限</th>
            <th scope="col">受講期限</th>
          </tr>
        </thead>
        <tbody>
          {
            json_search_result.map( (searchItem, index) => {

              const today               = new Date();
              const str_today           = today.getFullYear() + "-" +  ('0' + (today.getMonth()+1)).slice(-2) + "-" + ('0' +today.getDate()).slice(-2); 
              const training_id         = String( searchItem.qualification_training_employee_site_id );
              const site_code           = searchItem.site_code;
              const site_name           = searchItem.site_name;
              const is_needed_attendance= searchItem.is_needed_attendance;
              const attended_on         = searchItem.attended_on;
              const expiration_on       = searchItem.expiration_on;
              const deadline_on         = searchItem.deadline_on;

              let   color;
              const number                  = index + 1;
              const id_tr_emp_checkbox      = "checkedTrainingEmployeeSiteId_"   + training_id;
              const id_check_training_name  = "checkedTrainingEmployeeSiteName_" + training_id;

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
                      <input className="form-check-input" type="radio" id={id_tr_emp_checkbox} name="checkedTrainingEmployeeSiteId" value={training_id} stored={site_code} checked={this.state.checkedTrainingEmployeeSiteId === String(training_id)} onChange={ this.handleOnChange} />
                      <label className="form-check-label" htmlFor={id_tr_emp_checkbox}>
                      </label>
                    </div>
                  </td>
                  <td scope="col">{number}</td>
                  <td scope="col">{site_code}</td>
                  <td scope="col">{attended_on}</td>
                  <td scope="col">{expiration_on}</td>
                  <td scope="col">{deadline_on}</td>
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

export default  TrainingEmployeeSiteTable;
