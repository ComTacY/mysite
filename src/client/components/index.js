/***
**** (proj_root)/src/client/components/index.js
***/

import  React           from  "react";
import { BrowserRouter, Route, Switch, Link} from "react-router-dom";
import  i18n            from  "../locales/i18n";
import  axios           from  "axios";
import  Header          from  "./header";
import  Footer          from  "./footer";
import  Loading         from  "./loading"

import  Notfound        from  "./notfound.js";              //未該当画面
import  Mainmenu        from  "./mainmenu";                 //メインメニュー画面
import  Managementmenu  from  "./managementmenu";           //マネジメントメニュー
import  TrainingInfo    from  "./TrainingEmployeeInquiry";  //資格・教育・トレーニング情報照会
import  TrainingAttend  from  "./TrainingEmployeeAttend";   //教育・トレーニング受講登録

import  {ClientEnv} from  "../../../config/client_config";  //設定ファイル


class Index extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {

      //ログインユーザ情報
      employee_id:      0,
      login_id:         '',
      isManager:        false,
      isAdministrator:  false,

      //選択言語
      language:         'ja',

      //画面状態等
      isLoading:        true
    };
  }


  // すべての表示が終わったら
  componentDidMount() {

    // ユーザ情報取得 
    const axios_options = {
      method  : 'GET',
      url     : `${ClientEnv.base_url}:${ClientEnv.server_port}/api/v1/employee/getemployee/`,
      timeout : 30 * 1000  // ms
    };

    // 実行
    axios( axios_options )
    .then(response => {
      if( response.data.result === 'SUCCESS' ) {
        this.setState(
          {
            login_id:         response.data.data.login_id,        //req -> api -> db -> res
            employee_id:      response.data.data.employee_id,
            isManager:        response.data.data.is_manager,
            isAdministrator:  response.data.data.is_administrator  
          }
        );
      }

      /* ログ */
      console.log(  this.constructor.name + '.Constructor: axios: [' + axios_options.method + '] url[' + axios_options.url + '] TimeOut[' + axios_options.timeout + '] ' 
                  + 'login_id[' + this.state.login_id + '] ' + 'employee_id[' + this.state.employee_id + '] ' 
                  + 'isManager[' + this.state.isManager + '] ' + 'isAdministrator[' + this.state.isAdministrator + '] '
                  + 'language[' + this.state.language + '] ' );

      /* ... loading解除 */
      this.setState( {isLoading: false} );
    });
  }


  render() {
    if( this.state.isLoading ) {
      return(
        <div className="container-xl">
          <Loading/>
        </div>
      );
    }
    else{
      return (
        <div className="container-xl">
          <Header/>
          <BrowserRouter>
            <Switch>
              <Route exact path='/'               render={ () => <Mainmenu state={this.state}/> }/>
              <Route exact path='/MainMenu'       render={ () => <Mainmenu state={this.state}/> }/>
              <Route exact path='/ManagementMenu' render={ () => <Managementmenu state={this.state}/> }/>
              <Route exact path='/TrainingInfo'   render={ () => <TrainingInfo state={this.state}/> }/>
              <Route exact path='/TrainingAttend' render={ () => <TrainingAttend state={this.state}/> }/>
              <Route component={Notfound}/>
            </Switch>            
          </BrowserRouter>
          <Footer/>
        </div>
      );
    }
  }
}

export default Index;
