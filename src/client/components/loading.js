/***
**** (proj_root)/src/client/components/loading.js
***/

import  React     from  "react";

class Loading extends React.Component {

  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div className="row">
        <div className="col-xl">
        </div>
        <div className="col-xl">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="col-xl">
        </div>
      </div>
   );
  }
}

export default Loading;
