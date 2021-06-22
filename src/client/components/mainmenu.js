/***
**** (proj_root)/src/client/components/main.js
***/

import  React           from  "react";
import  { withRouter }  from  "react-router";
import  i18n            from  "../locales/i18n";
import  {ClientEnv}     from  "../../../config/client_config";  //設定ファイル


class Mainmenu extends React.Component {

constructor( props ) {
    super( props );

    this.state = {

      //ログインユーザ情報
      employee_id:      this.props.state.employee_id,
      login_id:         this.props.state.login_id,
      isManager:        this.props.state.isManager,
      isAdministrator:  this.props.state.isAdministrator,

      //選択言語
      language:         this.props.state.language,

      //画面状態等
      isLoading:        false //もしロードするものがあるならここでTrue
    };

    if( this.state.login_id === ('' || null || undefined) ) {
      //直接叩かれた
      this.props.history.push('/');
    }    

    //ハンドルをバインド
    this.handleButtonClick = this.handleButtonClick.bind( this );

    /* ログ */
    console.log(  this.constructor.name + '.Constructor: '
                + 'login_id[' + this.state.login_id + '] ' + 'employee_id[' + this.state.employee_id + '] '
                + 'isManager[' + this.state.isManager + '] ' + 'isAdministrator[' + this.state.isAdministrator + '] '
                + 'language[' + this.state.language + '] ' );
  }
            
  //ボタンイベント
  handleButtonClick( event ) {
    const target  = event.target;
    const name    = target.name;

    switch( name )
    {
      case  'btn1':
        //資格・教育・トレーニング情報照会
        this.props.history.push( '/TrainingInfo' );
        break;
      case  'btn2':
        //教育・トレーニング完了登録      
        this.props.history.push( '/TrainingAttend' );       
        break;
      case  'btn3':
        //マネジメントメニュー
        this.props.history.push( '/ManagementMenu' );
        break;
      case  'btn4':
        //システムアドミニストレータメニュー
        break;
      default:
            break;
    }
  }

  render() {

    const is_manager        = this.state.isManager;
    const is_administrator  = this.state.isAdministrator;
    const manager_disabled  = is_manager        ?   false : true;
    const admin_disabled    = is_administrator  ?   false : true;    

    return(
      <div className="row">
        <div className="row">
          <div className="col-xl"><h3>メインメニュー</h3></div>
        </div>
        <div className="row">
          <div className="d-grid gap-2 col-xl mx-auto">
            <button className="btn btn-primary" type="button" name="btn1" onClick={ this.handleButtonClick }>
              資格・教育・トレーニング情報照会
            </button>
            <button className="btn btn-primary" type="button" name="btn2" onClick={ this.handleButtonClick }>
              教育・トレーニング完了登録
            </button>
            <button className="btn btn-primary" type="button" name="btn3" onClick={ this.handleButtonClick } hidden={manager_disabled}>
              マネジメントメニュー
            </button>
            <button className="btn btn-primary" type="button" name="btn4" onClick={ this.handleButtonClick } hidden={admin_disabled}>
              システムアドミニストレータメニュー
            </button>
          </div>
        </div>
      </div>
    );
  } 
}

export default withRouter( Mainmenu );
