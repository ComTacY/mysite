/***
**** (proj_root)/src/client/client.js
***/
import  React       from  "react";
import  ReactDOM    from  "react-dom";
import  Index       from  "./components/index";

import  {ClientEnv} from  "../../config/client_config";

const root = document.getElementById('root');
ReactDOM.render(<Index/>, root);
