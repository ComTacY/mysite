/***
**** (proj_root)/src/client/components/TrainingEmployeeEntryAttendModal.js
***/

import  React       from  "react";
import  axios       from  "axios";
import  i18n        from  "../locales/i18n";
import  Loading     from  "./loading";
import  {ClientEnv} from  "../../../config/client_config";  //設定ファイル
import TrainingEmployeeTable from "./TrainingEmployeeEmployeeTable";

class TrainingEntryAttendModal extends React.Component {

  /***
  * コンストラクタ　システム予約関数 *
  ***/
  constructor( props ) {
    super( props );

    /* 親よりもらうデータ */
    this.mode             = this.props.mode;
    this.target_login_id  = this.props.target_login_id;
    this.employee_id      = this.props.employee_id;
    this.language         = this.props.language;

    /* ステート */
    this.state      = {
      training_employee_id:       0,
      training_employee_name:     '',
      updateTrainingEmployeeDate: '',
      has_error:                  false,
      error_msg:                  ''
    }

    /* ハンドルバインド */
    this.handleOnChange  = this.handleOnChange.bind(this);
    this.handleOnClick   = this.handleOnClick.bind(this);

    /* ログ */
    console.log(  this.constructor.name + '.Constructor: mode[' + this.mode + '] target_login_id[' + this.target_login_id + '] my_employee_id[' + this.employee_id + ']' );
  }

  /***
   * すべての表示が終わったらシステム予約関数 *
  ***/
  componentDidMount() {
    this.entry_training_employee_modal  = new bootstrap.Modal( document.getElementById('entryTrainingEmployee'),
    {
      keyboard: false,
      backdrop: 'static',
      focus:    true
    }
  ); //モーダルを作成
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
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;
    const name    = target.name;

    this.setState( { [name]: value } );
  }

  /***
   * ボタン押下ハンドラ *
  ***/
  handleOnClick( event ) {
    const target  = event.target;
    const name    = target.name;
  
    if( name === 'nameHideModal' ) {
      //閉じる
      this.hideModal();
    }
    else if( name === 'nameEntryAttends' ) {
      //更新
      this.updateTrainingEmployee();
    }
  }
  
  /***
   * 他コンポーネントからModal起動 from TrainingEmployeeSearchForm*
  ***/
  showModal = ( training_employee_id, training_employee_name ) => {

    console.log( `show training_employee_id[${training_employee_id}] training_employee_name[${training_employee_name}]` );

    this.setState(
      {
        training_employee_id:     training_employee_id,
        training_employee_name:   training_employee_name,
        has_error:                false,
        error_msg:                ''
      },
      () => { 
        /* Modalを表示 */
        this.entry_training_employee_modal.show();
      }
    );
  }

  /***
   * このコンポーネントで起動 -> 閉じる *
  ***/
  hideModal = () => {

    console.log( `hide` );

    /* Modalを消去 */
    this.entry_training_employee_modal.hide();
  }

  /***
   * 更新処理 *
  ***/
  async updateTrainingEmployee() {

    const post_data = {

      qualification_training_employee_id: this.state.training_employee_id,
      attended_on                       : this.state.updateTrainingEmployeeDate,
      updated_by                        : this.employee_id,
    }

    console.log(    "post_data.qualification_training_employee_id[" + this.state.checkedTrainingEmployeeId + "] post_data.attended_on [" + this.state.updateTrainingEmployeeDate + "] "
                  + "post_data.updated_by[" + this.employee_id + "]" );

    // 検索実行 
    let axios_options = {
      method  : 'POST',
      url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/trainingemployee/update/` ,
      data    : post_data,
      timeout : 30 * 1000  // ms
    };

    /* ログ */
    console.log(  this.constructor.name + '.getSearch: METHOD[' + axios_options.method + '] URL[' + axios_options.url + '] options[' + axios_options.data + ']' );

    // 実行
    let response = await axios( axios_options );
    if( response.data.result === 'SUCCESS' ) {
      /* 更新完了 */
      this.hideModal();
    }
    else {
      /* 更新失敗 */
      this.setState(
        {
          has_error:  true,
          error_msg:  '登録処理に失敗しました。'
        }
      );
    }
  }
 
  /***
   * 書き込み処理 *
  ***/
  render() {
    //受講設定のモーダル準備
    let err_msg_jsx;

    if( this.state.has_error ) {
      err_msg_jsx = (
        <div class="alert alert-danger" role="alert">
          {this.state.error_msg}
        </div>
      );
    }

    return  (
      <div className="modal fade" id="entryTrainingEmployee" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="entryTrainingEmployeeLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="entryTrainingEmployeeLabel">受講登録</h5>
              <button type="button" className="btn-close" name="nameHideModal" onClick={this.handleOnClick} aria-label="閉じる"></button>
            </div>

            <div className="modal-body">
              <p>受講登録 [{this.state.training_employee_name}]</p>
              <form className="row row-cols-xl-auto g-3 align-items-center">
                <div className="col-xl">
                  <label className="visually-hidden" htmlFor="flatpickr">受講日付</label>
                  <div className="input-group">
                    <div className="input-group-text">受講日付</div>
                    <input className="form-control flatpickr-input" type="text" data-mindate="today" id="flatpickr" name="updateTrainingEmployeeDate" onChange={this.handleOnChange} value={this.state.updateTrainingEmployeeDate} placeholder="受講日付"/>
                  </div>
                </div>
              </form>
              {err_msg_jsx}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" name="nameHideModal"  onClick={this.handleOnClick}>閉じる</button>
              <button type="button" className="btn btn-primary" name="nameEntryAttends" onClick={this.handleOnClick}>受講登録</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrainingEntryAttendModal;
