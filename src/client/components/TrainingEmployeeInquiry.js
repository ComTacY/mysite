/***
**** (proj_root)/src/client/components/traininginfo.js
***/

import  React                       from  "react";
import  { withRouter }              from  "react-router";
import  i18n                        from  "../locales/i18n";
import  axios                       from  "axios";
import  Loading                     from  "./loading";
import  {ClientEnv}                 from  "../../../config/client_config";  //設定ファイル
import  TrainingEmployeeSearchForm  from  "./TrainingEmployeeSearchForm";
import  TrainingEmployeeTable       from  "./TrainingEmployeeEmployeeTable";


class TrainingInfo extends React.Component {
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
      isLoading:        false,  //ロード中はTrue

      //検索用項目
      searchLogin:    '',
      searchCategory: '0',
      searchClass:    '0',
      searchAttend:   '0',

      //サイト別表示用項目
      checkedTrainingEmployeeId:  0
    };

    if( this.state.login_id === ('' || null || undefined) ) {
      //直接叩かれた
      this.props.history.push('/');
    }    

    //ハンドルをバインド
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick  = this.handleOnClick.bind( this );

    /* データ取得用変数初期化 */
    this.json_search_result = [];

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
   * 子コンポーネントから情報をもらう *
  ***/
  setSearchSelection = ( searchLogin, searchCategory, searchClass, searchAttend )  => {

    console.log( `this[${this.constructor.name}] sLogin[${searchLogin}] sCate[${searchCategory}] sClass[${searchClass}] sAttend[${searchAttend}]` );

    this.setState(
      {
        searchLogin:      searchLogin,
        searchCategory:   searchCategory,
        searchClass:      searchClass,
        searchAttend:     searchAttend
      }
    );
  }
 
  /***
   * 子コンポーネントから検索を掛ける *
  ***/
  getSearchData = ()  => {

    console.log( `getSearchData sLogin[${this.state.searchLogin}] sCate[${this.state.searchCategory}] sClass[${this.state.searchClass}] sAttend[${this.state.searchAttend}]` );

    /* 実施 */
    this.getSearchEmployee();
  }
  
  /***
   * 資格・教育・トレーニング・従業員データ取得 *
  ***/
  async getSearchEmployee() {
  
    /* 読み込み中 */
    this.setState( {isLoading: true} );

    const post_data = {
      searchLogin:      this.state.searchLogin,
      searchCategory:   this.state.searchCategory === (''|undefined|null) ? '0' : this.state.searchCategory,
      searchClass:      this.state.searchClass    === (''|undefined|null) ? '0' : this.state.searchClass,
      searchAttend:     this.state.searchAttend   === (''|undefined|null) ? '0' : this.state.searchAttend,
      searchEntryMode:  0,  //全表示モード　is_managaer_entry が ON/OFF両方とも全件読む
    }

    console.log(    "post_data.searchLogin[" + post_data.searchLogin + "] post_data.searchCategory [" + post_data.searchCategory + "] "
              + "post_data.searchClass[" + post_data.searchClass + "] post_data.searchAttend [" + post_data.searchAttend + "]" );

    // 検索実行 
    let axios_options = {
      method  : 'POST',
      url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/trainingemployee/login/` ,
      data    : post_data,
      timeout : 30 * 1000  // ms
    };

    /* ログ */
    console.log(  this.constructor.name + '.getSearch: METHOD[' + axios_options.method + '] URL[' + axios_options.url + '] options[' + axios.data + ']' );

    // 実行
    let response = await axios( axios_options );
    if( response.data.result === 'SUCCESS' ) {
      this.json_search_result = response.data.data;
    }
    else {
      this.json_search_result = [];
    }

    /* 読み込み完了 */
    this.setState( {isLoading: false} );
  }


  /***
   * 書き込み処理 *
  ***/
  render() {

    let table_render_jsx;
    let render_jsx;

    //読み込み終わり
    if( this.state.isLoading )  {
      table_render_jsx = "";
    }
    else {
      table_render_jsx = ( 
        <TrainingEmployeeTable
          language                = {this.state.language}
          mode                    = {0}
          target_login_id         = {''}
          training_employee_data  = {this.json_search_result}
        />          
      );
    }

    render_jsx = (
      <div className="row">
        <div className="row">
          <div className="col-x1">
            <h3>資格・教育・トレーニング情報照会</h3>
          </div>
        </div>

        <TrainingEmployeeSearchForm
            language            = {this.state.language}
            mode                = {0}
            target_login_id     = {''}
            setSearchSelection  = {this.setSearchSelection}
            getSearchData       = {this.getSearchData}
        />

        { table_render_jsx }

        <table>
        </table>
      </div>
    );

    //読み込み中
    return( render_jsx );
  }
}

export default withRouter( TrainingInfo );
