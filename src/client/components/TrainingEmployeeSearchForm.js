/***
**** (proj_root)/src/client/components/TrainingEmployeeSearchForm.js
***/

import  React                     from  "react";
import  axios                     from  "axios";
import  i18n                      from  "../locales/i18n";
import  Loading                   from  "./loading";
import  {ClientEnv}               from  "../../../config/client_config";  //設定ファイル
import  TrainingEntryAttendModal  from  "./TrainingEmployeeEntryAttendModal";


class TrainingEmployeeSearchForm extends React.Component {

  /***
   * コンストラクタ　システム予約関数 *
  ***/
  constructor( props ) {
    super( props );

    /* 親よりもらうデータ */
    this.target_login__id         = this.props.target_login_id;
    this.employee_id              = this.props.employee_id;
    this.mode                     = this.props.mode;
    this.language                 = this.props.language;
    this.ModalRef                 = React.createRef();  //React.createRef()で参照を作成
    this.getTrainingEmployeeId    = this.props.getTrainingEmployeeId;
    this.getTrainingEmployeeName  = this.props.getTrainingEmployeeName;

    /* ステート */
    this.state      = {
      searchLogin:      this.target_login__id,
      searchCategory:   0,
      searchClass:      0,
      searchAttend:     0,
      isLoading:        false
    }

    /* データ取得用変数初期化 */
    this.json_member_data   = [];
    this.json_category_data = [];
    this.json_class_data    = [];
    this.json_search_data   = [];
    this.json_search_result = [];

    /* ハンドルバインド */
    this.handleOnChange   = this.handleOnChange.bind(this);
    this.handleOnClick    = this.handleOnClick.bind(this);
 
      /* ログ */
    console.log(  this.constructor.name + '.Constructor: mode[' + this.mode + '] target_employee_id[' + this.target_login_id + ']');
  }

  /***
   * すべての状態更新終わったらシステム予約関数 *
  ***/
  componentDidMount() {

    /* 全ての描画が終わり次第APIでデータ取得 */
    this.getSelectionData( this.mode , this.target_login_id );
  }

  /***
   * すべての状態更新終わったら *
  ***/
  componentDidUpdate() {

  }
  
  /***
   * 項目変更ハンドラ *
  ***/
  handleOnChange( event ) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;
    const name    = target.name;

    this.setState( { [name]: value } );
  }

  /***
   * 項目変更ハンドラ *
  ***/
  handleOnClick( event ) {
    const target  = event.target;
    const name    = target.name;

    if( name === 'serchSubmit' ) {
      /* 検索イベントを起動 */      
      this.getSearchEmployee();
    }
    else if( name === 'entrySubmit' ) {

      /* 親コンポーネントの処理実行 -> データを取得 */
      const training_employee_id    = this.getTrainingEmployeeId();
      const training_employee_name  = this.getTrainingEmployeeName();

      /* 子コンポーネント処理実行   -> Modalを表示 */
      this.ModalRef.current.showModal( training_employee_id , training_employee_name );
    }
  }

  /***
   * 選択肢データ準備 *
  ***/
  async getSelectionData( mode , employee_id ) {
  
    /* 読み込み完了 */
    this.setState( {isLoading: true} );

    if( mode === 2 ) {
      //2: マネージャが受講登録できるカテゴリが設定されたトレーニングを見るためのもの

      // メンバ情報取得 
      let axios_options = {
        method  : 'GET',
        url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/employee/member/${employee_id}`,
        timeout : 30 * 1000  // ms
      };

      /* ログ */
      console.log(  this.constructor.name + '.getSelectionData Member: METHOD[' + axios_options.method + '] URL[' + axios_options.url + '] employee_id[' + employee_id + ']' );

      // 実行
      let response = await axios( axios_options );
      if( response.data.result === 'SUCCESS' ) {
        this.json_member_data = response.data.members;
      }
      else {
        this.json_member_data = [];
      }
    }

    // カテゴリ情報取得 
    let axios_options = {
      method  : 'GET',
      url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/category/mode/${mode}`,
      timeout : 30 * 1000  // ms
    };

    /* ログ */
    console.log(  this.constructor.name + '.getSelectionData Category: METHOD[' + axios_options.method + '] URL[' + axios_options.url + '] MODE[' + mode + ']' );

    // 実行
    let response = await axios( axios_options );
    if( response.data.result === 'SUCCESS' ) {
      this.json_category_data = response.data.data;
    }
    else {
      this.json_category_data = [];
    }

    // 区分情報取得 
    axios_options = {
      method  : 'GET',
      url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/class/all/`,
      timeout : 30 * 1000  // ms
    };
 
    /* ログ */
    console.log(  this.constructor.name + '.Class: METHOD[' + axios_options.method + '] URL[' + axios_options.url + ']' );

    // 実行
    response = await axios( axios_options );
    if( response.data.result === 'SUCCESS' ) {
      this.json_class_data = response.data.data;
    }
    else {
      this.json_class_data = [];
    }

    // 検索情報取得 
    this.json_search_data = [
      { id: 0, name: '全て' },
      { id: 1, name: '受講済' },
      { id: 2, name: '未受講' },
      { id: 3, name: '期限切' },
      { id: 4, name: '対象外' }
    ];

    /* 読み込み完了 */
    this.setState( {isLoading: false} );
  }

  /***
   * 検索処理 *
  ***/
  async getSearchEmployee() {
  
    /* 読み込み中 */
    this.setState( {isLoading: true} );

    const post_data = {
      searchLogin:      this.state.searchLogin,
      searchCategory:   this.state.searchCategory === (''|undefined|null) ? '0' : this.state.searchCategory,
      searchClass:      this.state.searchClass    === (''|undefined|null) ? '0' : this.state.searchClass,
      searchAttend:     this.state.searchAttend   === (''|undefined|null) ? '0' : this.state.searchAttend,
      searchEntryMode:  this.mode,  //0: 情報照会  1:教育・トレーニング受講登録  2:資格・特別教育取得登録 (Manager登録)
    }

    console.log(    "MODE[" + post_data.post_data + "] post_data.searchLogin[" + post_data.searchLogin + "] post_data.searchCategory [" + post_data.searchCategory + "] "
                  + "post_data.searchClass[" + post_data.searchClass + "] post_data.searchAttend [" + post_data.searchAttend + "]" );

    // 検索実行 
    let axios_options = {
      method  : 'POST',
      url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/trainingemployee/login/` ,
      data    : post_data,
      timeout : 30 * 1000  // ms
    };

    /* ログ */
    console.log(  this.constructor.name + '.getSearch: METHOD[' + axios_options.method + '] URL[' + axios_options.url + '] options[' + axios_options.data + ']' );

    // 実行
    let response = await axios( axios_options );
    if( response.data.result === 'SUCCESS' ) {
      //親クラスのMethod読み込み
      this.props.setSearchTrainingEmployeeData( this.state.searchLogin, response.data.data );
    }

    /* 読み込み完了 */
    this.setState( {isLoading: false} );
  }
  
  //書き込み処理
  render() {
    let   render_jsx;  
    let   login_jsx;
    let   modal_render_jsx;
    const is_read_only              = this.mode === 0 ? false : true;
    const is_hidden_complete_button = this.mode === 0 ? true : false;


    if( this.mode === 2 ) {
      login_jsx = (
        <div className="col-xl">
          <label className="visually-hidden" htmlFor="searchLogin">Login</label>
          <div className="input-group">
            <div className="input-group-text">ログイン</div>
            <select className="form-select" id="searchLogin" name="searchLogin" onChange={this.handleOnChange}  value={this.state.searchLogin} aria-label="ログイン">
              {this.json_member_data.map( memberItem => {
                return ( <option key={memberItem.employee_id} value={memberItem.login_id}>{memberItem.login_id}</option> );
              })}
            </select>
          </div>
        </div>
      );
    }
    else {
      login_jsx = (
        <div className="col-xl">
          <label className="visually-hidden" htmlFor="searchLogin">Login</label>
          <div className="input-group">
            <div className="input-group-text">ログイン</div>
            <input className="form-control" type="text" id="searchLogin" name="searchLogin" onChange={this.handleOnChange} value={this.state.searchLogin} placeholder="ログイン" readOnly={is_read_only} required/>
          </div>
        </div>
      );
    }

    //受講設定のモーダル準備
    modal_render_jsx =
    (
      <TrainingEntryAttendModal
        mode                    = {this.mode}
        target_login_idlogin_id = {this.target_login_id}
        employee_id             = {this.employee_id}
        language                = {this.language}
        ref                     = {this.ModalRef}
     />
    );

    if( !this.state.isTrainingEmployeeLoading ) {
      render_jsx =
      (
        <div>
          <form className="row row-cols-xl-auto g-3 align-items-center">

            {login_jsx}

            <div className="col-xl">
              <label className="visually-hidden" htmlFor="searchCategory">Category</label>
              <div className="input-group">
                <div className="input-group-text">カテゴリ</div>
                <select className="form-select" id="searchCategory" name="searchCategory" onChange={this.handleOnChange}  value={this.state.searchCategory} aria-label="カテゴリ">
                  <option value='0'>全て</option>
                  {this.json_category_data.map( categoryItem => {
                    return ( <option key={categoryItem.category_id} value={categoryItem.category_id}>{categoryItem.category_name}</option> );
                  })}
                </select>
              </div>
            </div>

            <div className="col-xl">
              <label className="visually-hidden" htmlFor="searchClass">Class</label>
              <div className="input-group">
                <div className="input-group-text">区分</div>
                <select className="form-select" id="searchClass" name="searchClass" onChange={this.handleOnChange}  value={this.state.searchClass} aria-label="区分">
                  <option value='0'>全て</option>
                  {this.json_class_data.map( classItem => {
                    return ( <option key={classItem.class_id} value={classItem.class_id}>{classItem.class_name}</option> );
                  })}
                </select>
              </div>
            </div>

            <div className="col-xl">
              <label className="visually-hidden" htmlFor="searchAttend">Class</label>
              <div className="input-group">
                <div className="input-group-text">検索方法</div>
                  <select className="form-select" id="searchAttend" name="searchAttend" onChange={(event) => {this.handleOnChange(event)}}  value={this.state.searchAttend} aria-label="検索方法">
                    {this.json_search_data.map( attendItem => {
                      return ( <option key={attendItem.id} value={attendItem.id}>{attendItem.name}</option> );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-xl">
              <button type="button" className="btn btn-primary" name="serchSubmit" onClick={this.handleOnClick}>検索</button>
            </div>

            <div className="col-xl">
              <button type="button" className="btn btn-primary" name="entrySubmit" onClick={this.handleOnClick} hidden={is_hidden_complete_button}>完了</button>
            </div>
          </form>
          {modal_render_jsx}
        </div>
      );
    }

    //読み込み中
    return( render_jsx );
  }
}

export default TrainingEmployeeSearchForm;
