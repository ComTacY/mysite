/***
**** (proj_root)/src/client/components/header.js
***/

import  React     from  "react";
import  log_tms   from  "../img/log_tms.jpg";
import  log_rme   from  "../img/log_rme.jpg";


class Header extends React.Component {

  constructor( props ) {
    super( props );
  }
  
  render() {
    return (
      <div className="row align-items-center">
        <div className="col-xl">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">
                <img src={log_tms} alt="" width="45" height="30" className="d-inline-block align-top"/>
                Talent Management System
              </a>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  <a className="nav-link" aria-current="page" href="/MainMenu">メインメニュー</a>
                </div>
              </div>
            </div>
          </nav>
        </div>
     </div>
    );
  }
}

export default Header;
