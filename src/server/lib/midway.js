function express( options ) {

  return (
    function (req, res, next) {
     
      const forwardedUser = req.headers['x-forwarded-user'];
      const clientVerify  = req.headers['x-client-verify'];
      
      if( options === undefined ) {
        options = {};
      }

      const defaultUser = options.defaultUser !== (undefined || '') ? options.defaultUser : "nobody";
      
      if (process.env.NODE_ENV !== "production") {
        user = process.env.USER || defaultUser;
      }
      else {
        if (clientVerify === "SUCCESS" || options.strictClientVerify === false) {
          user = forwardedUser.split("@")[0] || defaultUser;
        }
        else {
          user = defaultUser;
        }
      }

      res.locals.user = user;

      next();
    }
  );
}

module.exports = express; 
