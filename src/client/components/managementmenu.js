/***
**** (proj_root)/src/client/components/managementmenu.js
***/

import  React     from  "react";
import  { withRouter }  from "react-router";
import  i18n      from  "../locales/i18n";



class Managementmenu extends React.Component {

  constructor( props ) {
    super( props );

    /* 前画面からstate取得 */
    this.state = {
      //環境っぽいもの
      base_url:         this.props.state.base_url,
      server_port:      this.props.server_port,

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

    switch( name ) {
      case  'btn1':
        //資格・教育・トレーニング受講設定
        break;
      case  'btn2':
        //資格・特別教育取得登録
        break;
      case  'btn3':
        //勤怠管理
        break;
      default:
        //メインメニュー
        this.props.history.push( '/MainMenu' );
        break;
    } 
  }

  render() {

    if( this.state.isLoading ) {
      return(
        <Loading/>
      );
    }
    else{
      return(
        <div className="main-area">
          <h3>マネジメントメニュー</h3>
          <div className="d-grid gap-2 col-6 mx-auto">
            <button className="btn btn-primary" type="button" name="btn1" onClick={ (event) => {this.handleButtonClick(event)} }>資格・教育・トレーニング受講設定</button>
            <button className="btn btn-primary" type="button" name="btn2" onClick={ (event) => {this.handleButtonClick(event)} }>資格・特別教育取得登録</button>
            <button className="btn btn-primary" type="button" name="btn3" onClick={ (event) => {this.handleButtonClick(event)} }>勤怠管理</button>
            <button className="btn btn-primary" type="button" name="btn4" onClick={ (event) => {this.handleButtonClick(event)} }>メインメニュー</button>
          </div>
        </div>
      );
    }
  } 
}

export default withRouter( Managementmenu );
