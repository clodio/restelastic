var fs = require('fs');
var path = require('path');
/**
 * AssetsController
 *
 * @description :: Server-side logic for managing Assets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  assets :function(req, res) {

          // Get the file path of the file on disk
          var filePath=path.resolve(sails.config.appPath + "/assets/" + req.originalUrl);

          fs.stat(filePath, function(err, stat) {
            if(err) {
              res.send(404);
            }
            else {
              if (filePath.indexOf(".css")>0) {
                res.type('text/css');
              }
              if (filePath.indexOf(".html")>0) {
                  res.type('text/html');
              }
              fs.createReadStream(filePath).pipe(res);
            }
        });

    }

};
