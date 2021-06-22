/***
**** (proj_root)/src/client/components/footer.js
***/
import  React     from  "react";
import  log_rme   from  "../img/log_rme.jpg";


class Footer extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xl"></div>
        <div className="col-xl align-items-center"><img src={log_rme}/></div>
        <div className="col-xl"></div>
      </div>
  );
  }
}

export default Footer;