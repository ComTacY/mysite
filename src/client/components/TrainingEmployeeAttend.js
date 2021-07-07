/***
**** (proj_root)/src/client/components/TrainingEmployeeAttend.js
***/

import  React                       from  "react";
import  { withRouter }              from  "react-router";
import  i18n                        from  "../locales/i18n";
import  axios                       from  "axios";
import  {ClientEnv}                 from  "../../../config/client_config";  //設定ファイル
import  Loading                     from  "./loading";
import  TrainingEmployeeSearchForm  from  "./TrainingEmployeeSearchForm";
import  TrainingEmployeeTable       from  "./TrainingEmployeeEmployeeTable";

  /***
   * コンストラクタ　システム予約関数 *
  ***/
  class TrainingAttend extends React.Component {

    constructor( props ) {
    super( props );

    /* 前画面からstate取得 */
    this.state = {

      //ログインユーザ情報
      employee_id:      this.props.state.employee_id,
      login_id:         this.props.state.login_id,
      isManager:        this.props.state.isManager,
      isAdministrator:  this.props.state.isAdministrator,

      //選択言語
      language:         this.props.state.language,

      //画面状態等
      isTrainingEmployeeLoading:        false,    //TrainingEmployee表ロード中はTrue
      isTrainingEmployeeSiteLoading:    false,    //TrainingEmployeeSite表ロード中はTrue

      //照会検索結果
      target_login_id:    '',
      json_search_training_employee_result:       [],
      json_search_training_employee_site_result:  [],

      //サイト別表示用項目
      checkedTrainingEmployeeId:        0,
      checkedTrainingEmployeeName:      '',
    };

    if( this.state.login_id === ('' || null || undefined) ) {
      //直接叩かれた
      this.props.history.push('/');
    }    

    //ハンドルをバインド
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick  = this.handleOnClick.bind( this );

    /* ログ */
    console.log(  this.constructor.name + '.Constructor: '
                + 'login_id[' + this.state.login_id + '] '    + 'employee_id[' + this.state.employee_id + '] '
                + 'isManager[' + this.state.isManager + '] '  + 'isAdministrator[' + this.state.isAdministrator + '] '
                + 'language[' + this.state.language + '] ' );
  }

  /***
   * すべての表示が終わったらシステム予約関数 *
  ***/
  componentDidMount() {
 
    /* ユーザ画面表示 */
//    this.getSearch();
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
  }

  /***
   * ボタン押下ハンドラ *
  ***/
  handleOnClick( event ) {
  }

  /***
   * 子コンポーネントから情報をもらう from TrainingEmployeeSearchForm*
  ***/
  setSearchTrainingEmployeeData = ( target_login_id, serchData )  => {

    this.setState(
      {
        isTrainingEmployeeLoading             : true,
        target_login_id                       : target_login_id,
        json_search_training_employee_result  : serchData
      },
      ()=> {
        this.setState( { isTrainingEmployeeLoading: false } );
      }
    );
  }

  /***
   * 子コンポーネントから情報をもらう from TrainingEmployeeSearchTable*
  ***/
  setSelectedRow = ( selected_row_key , selected_training_name )  => {

    console.log( `this[${this.constructor.name}] selected_row_key[${selected_row_key}] selected_training_name[${selected_training_name}]` );

    this.setState(
      {
        checkedTrainingEmployeeId:    selected_row_key,
        checkedTrainingEmployeeName:  selected_training_name
      },
      ()=> {
      }
    );
  }

  /***
   * 子コンポーネントから情報問い合せ form TrainingEmployeeSearchForm*
  ***/
  getTrainingEmployeeId = () => {
    return( this.state.checkedTrainingEmployeeId );
  }

  /***
   * 子コンポーネントから情報問い合せ form TrainingEmployeeSearchForm*
  ***/
  getTrainingEmployeeName = () => {
    return( this.state.checkedTrainingEmployeeName );
  }

  /***
   * 書き込み処理 *
  ***/
  render() {

    let form_render_jsx;
    let table_render_jsx;
    let render_jsx;

    form_render_jsx = (
      <TrainingEmployeeSearchForm
        language                      = {this.state.language}
        mode                          = {1}   //自分自身が更新
        target_login_id               = {this.state.login_id}
        employee_id                   = {this.state.employee_id}
        setSearchTrainingEmployeeData = {this.setSearchTrainingEmployeeData}
        getTrainingEmployeeId         = {this.getTrainingEmployeeId}
        getTrainingEmployeeName       = {this.getTrainingEmployeeName}
      />
    );
  
    //読み込み終わり
    if( !this.state.isTrainingEmployeeLoading ) {
        table_render_jsx = ( 
          <TrainingEmployeeTable
            language                = {this.state.language}
            mode                    = {1}   //自分自身が更新
            target_login_id         = {this.state.login_id}
            training_employee_data  = {this.state.json_search_training_employee_result}
            setSelectedRow          = {this.setSelectedRow}
         />          
        );
    }
  
    //表示処理
    render_jsx = (
      <div className="row">
        <div className="row">
          <div className="col-x1">
            <h3>資格・教育・トレーニング情報照会</h3>
          </div>
        </div>
        { form_render_jsx }
        { table_render_jsx }
        <table>
        </table>
      </div>
    );

    //読み込み中
    return( render_jsx );
  }
}

export default withRouter( TrainingAttend );
