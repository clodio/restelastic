var crypto = require('crypto');
/**
 * RessourceController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//Retrieve one ressource
  findOne :function (req, res) {

    // Get the id parameter from the URI route
    if (req.params) {
      Ressource.findOne(req, req.query , function (err, outputRessource) {
        if (err && err.error =="not_found") {
        	// send a 404 Not Found
          return res.send(404, "{}");
        }
        else if (err) {
          ReportError.error(req,err,"ERR_500_0017");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else {

        	if (outputRessource.etag === req.headers['if-none-match'] && req.headers['if-none-match'] != null) {
        		// The client has already the last version of the ressource : do'nt send document, only 304 Not modiied response
        		return res.send(304);
        	}
        	else {
        			//Send normal response
        			res.setHeader("Etag", '"' +outputRessource.etag +'"');
        			return res.json(outputRessource);
        	}
        }
      });
    }
    else {
    		// it should nevever happen since this function should not be called without param
        return res.notFound("{}");
    }
 },



	// search ressources
  findAll :function (req, res) {
    sails.log("controller:findAll");

    var DSLQuerySizeMax = sails.config.blueprints.maxLimit || 1000; //max ressource for paginate
    if (req.query.count > DSLQuerySizeMax) {
        return res.send(400, [{"error": "max_pagination_count","error_description": "Pagination 'count' is limited to " + DSLQuerySizeMax + " items per page." }]);
    }

    Ressource.findAll(req, function (err, outputRessource) {
      if (err && err.error =="index_not_found") {
        // send a 404 Not Found
        sails.log.warn("WARN#500_2001");
        return res.send(500, [{"error": "index_not_found","error_description": err.error_description }]);
      }
      else if (err && err.error) {
        ReportError.error(req,err,"ERR_500_0002");
        return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
      }
      else {
			  //generate etag
    		var etag = crypto.createHash('md5').update(JSON.stringify(outputRessource)).digest('hex').substring(0,10);
    		if (etag === req.headers['if-none-match']) {
      		// The client has already the last version of the ressource : do not send document, only 304 Not modiied response
      		return res.send(304);
      	}
      	else {
      		//send response OK
					res.setHeader("Etag", '"' +etag + '"');
    			return res.json(outputRessource);
      	}
      }
    });
 },


 // search ressources
  search :function (req, res) {
      var DSLQuerySizeMax = 20; //max ressource for paginate
      if (req.query.count > DSLQuerySizeMax) {
          return res.send(400, [{"error": "max_pagination_count","error_description": "Pagination 'count' is limited to " + DSLQuerySizeMax + " items per page." }]);
      }

      Ressource.search(req, function (err, outputRessource) {
        if (err) {
          ReportError.error(req,err,"ERR_500_0003");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else {
           //generate etag
           var etag = crypto.createHash('md5').update(JSON.stringify(outputRessource)).digest('hex').substring(0,10);
           if (etag === req.headers['if-none-match']) {
             // The client has already the last version of the ressource : do not send document, only 304 Not modiied response
             return res.send(304);
           }
           else {
             //send response OK
             res.setHeader("Etag", '"' +etag + '"');
             return res.json(outputRessource);
           }
        }
      });
   },




	alter :function (req, res) {

    sails.log('alter:controller');
    //test if body is not empty
    if (  !Object.keys(req.body).length ) {
         return res.send(400, [{"error": "wrong_body","error_description": "The http body request is invalid or empty" }]);
    }
    //test if etag header is sent
		if ( req.headers['if-none-match'] && isNaN( req.headers['if-none-match']) ) {
         return res.send(400, [{"error": "header_if-none-match_error","error_description": "header  if-none-match should be a number" }]);
    }

    // Get the id parameter from the URI route
    if (req.params.id && req.body.id) {
      if (req.params.id != req.body.id) {
          return res.send(400, [{"error": "wrong_id","error_description": "id in url " + req.params.id + " do not match id in body " + req.body.id }]);
      }
    }

    //add id inside body or params if not present
    if (req.params.id) {
      req.body.id = req.params.id;
    }
    else if (req.body.id) {
      req.params.id= req.body.id;
    }
    if (req.params.id) {

      // Use it to look up a different field
      Ressource.alter(req, function (err, outputRessource) {
        if (err && err.error=="not_found") {
          return res.send(404,"");
        }
        else if (err && err.error=="ressource_version_conflict") {
          return res.send(412, [{"error": err.error,"error_description": "Conflict on ressource " +req.params.id + " : Etag " + req.headers['if-none-match'] + " not matching"}]);
        }
        else if (err && err.error=="wrong_arguments") {
          return res.send(400, [{"error": err.error,"error_description": err.error_description}]);
        }
        else if (err) {
          ReportError.error(req,err,"ERR_500_0004");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else {
        	// Send response OK
          //res.etag(crypto.createHash('md5').update(JSON.stringify(outputRessource)).digest('hex'));
        	res.setHeader("Etag", outputRessource.etag);
        	res.location(req.protocol + "://" + req.headers.host +  req.path );
          return res.json(outputRessource);
        }
      });
    }
    else {
        return res.notFound();
    }
},






	create :function (req, res) {
      // Get the id parameter from the URI route
      sails.log('create:controller');

      //test if body is not empty
      if (  !Object.keys(req.body).length ) {
           return res.send(400, [{"error": "wrong_body","error_description": "The http body request is invalid or empty" }]);
      }
			if ( req.headers['if-none-match'] && isNaN( req.headers['if-none-match']) ) {
           return res.send(400, [{"error": "header_if-none-match_error","error_description": "header  if-none-match should be a number" }]);
      }
      if (req.params.id && req.body.id) {
        if (req.params.id != req.body.id) {
            return res.send(400, [{"error": "wrong_id","error_description": "id in url " + req.params.id + " do not match id in body " + req.body.id }]);
        }
      }
      if (!req.params.id && req.body.id) {
        //body.id should not be present
        return res.send(400, [{"error": "error_id","error_description": "id must not be present while creating ressource" }]);
      }
      //add id inside body or parmas if not present
      if (req.params.id) {
        req.body.id = req.params.id;
      }

      Ressource.create(req,req.body, function (err, outputRessource) {
        if (err && err.error=="ressource_version_conflict") {
          return res.send(409, [{"error": err.error,"error_description": "Conflict : ressource " +req.params.id + " already exist"}]);
        }
        else if (err && err.error=="wrong_arguments") {
          return res.send(400, [{"error": err.error,"error_description": err.error_description}]);
        }
        else if (err && err.created===false) {
          ReportError.error(req,err,"ERR_500_0005");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else if (err) {
          ReportError.error(req,err,"ERR_500_0006");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else {
         //res.setHeader("Etag", crypto.createHash('md5').update(JSON.stringify(outputRessource)).digest('hex'));
          res.setHeader("Etag", outputRessource.etag);
          res.location(req.protocol + "://" + req.headers.host +  req.path + '/' + outputRessource.id);
          return res.send(201, outputRessource);
        }
      });
   },


   // Alter or create ressource : used with PUT verb
   // if etag is not send and creation_date is not null : full uptage with the creation_date
   // if ressource not exist --> create
   // if ressource exist
   //     if etag is not null and is different from ressource --> 412
   //     else
   //          if etag is send and match ressource --> update with old creation_date
   //          if etag is not send --> full update with old creation_date
   alterOrCreate :function (req, res) {

       sails.log('alterOrCreate:controller');
       //test if body is not empty
       if (  !Object.keys(req.body).length ) {
            return res.send(400, [{"error": "wrong_body","error_description": "The http body request is invalid or empty" }]);
       }
       //Test ressource version etag : If-none-Match
       if ( req.headers['if-none-match'] && isNaN( req.headers['if-none-match']) ) {
            return res.send(400, [{"error": "header if-none-match error","error_description": "header  if-none-match should be a number" }]);
       }
       // Get the id parameter from the URI route
       if (req.params.id && req.body.id) {
         if (req.params.id != req.body.id) {
             return res.send(400, [{"error": "wrong_id","error_description": "id in url " + req.params.id + " do not match id in body " + req.body.id }] );
         }
       }
       //add id inside body or params if not present
       if (req.params.id) {
         req.body.id = req.params.id;
       }
       else if (req.body.id) {
         req.params.id= req.body.id;
       }

       // if etag is not send and creation_date is not null : full uptage with the creation_date
       if ( ! req.headers['if-none-match'] && req.params.creation_date ) {
         //full update with creation_date
       }
       else {
         //retrieve ressource
         Ressource.findOne(req, req.query , function (err, outputRessource) {
           if (err && err.error =="not_found") {

             //fullUpdate
            Ressource.fullUpdate(req,req.body, function (err, outputRessource) {
              if (err && err.error=="ressource_version_conflict") {
                //console.sails.log("409:conflict");
                //todo : send 404 before 409
                return res.send(409, [{"error": err.error,"error_description": "Conflict : ressource " +req.params.id + " already exist"}]);
              }
              else if (err && err.error=="wrong_arguments") {
                return res.send(400, [{"error": err.error,"error_description": err.error_description}]);
              }
              else if (err && err.created===false) {
                ReportError.error(req,err,"ERR_500_0007");
                return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
              }
              else if (err) {
                ReportError.error(req,err,"ERR_500_0008");
                return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
              }
              else {
                res.setHeader("Etag", outputRessource.etag);
                res.location(req.protocol + "://" + req.headers.host +  req.path + '/' + outputRessource.id);
                return res.send(201, outputRessource);
              }
            });
           }
           else if (err) {
             ReportError.error(req,err,"ERR_500_0009");
             return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
           }
           else {
             //ressource found
            //if etag is not null and is different from ressource --> 412
           	if (outputRessource.etag !== req.headers['if-none-match'] && req.headers['if-none-match'] != null) {
           		// The version of the resource is not the same than the client : send conflict error
              return res.send(412, [{"error": "ressource_version_conflict","error_description": "Conflict on ressource " +req.params.id + " : Etag " + req.headers['if-none-match'] + " not matching"}]);
           	}
           	else {
           			// full update ressource with creation_date if send
                req.params.doc_as_upsert=true;

                Ressource.fullUpdate(req,req.body, function (err, outputRessource) {
                  if (err && err.error=="ressource_version_conflict") {
                    return res.send(409, [{"error": err.error,"error_description": "Conflict : ressource " +req.params.id + " already exist"}]);
                  }
                  else if (err && err.error=="wrong_arguments") {
                    return res.send(400, [{"error": err.error,"error_description": err.error_description}]);
                  }
                  else if (err && err.created===false) {
                    ReportError.error(req,err,"ERR_500_0010");
                    return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
                  }
                  else if (err) {
                    ReportError.error(req,err,"ERR_500_0011");
                    return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
                  }
                  else {
                   //res.setHeader("Etag", crypto.createHash('md5').update(JSON.stringify(outputRessource)).digest('hex'));
                    res.setHeader("Etag", outputRessource.etag);
                    res.location(req.protocol + "://" + req.headers.host +  req.path + '/' + outputRessource.id);
                    return res.send(200, outputRessource);
                  }
                });
           	}
           }
         });
       }
    },





   //delete one ressource
   deleteOne :function (req, res) {

			//used with DELETE verb
      sails.log('deleteOne:controller');

			// Get the id parameter from the URI route
      if (!req.params.id ) {
            return res.send(409, [{"error": "missing_id","error_description": "You must provide ressource ID"}]);
      }

      Ressource.deleteOne(req, function (err, outputRessource) {

        if (err && err.error=="not_found") {
        	//the document was not existing
          return res.send(404,"");
        }
        else if (err && err.error=="ressource_version_conflict") {
            return res.send(412, [{"error": "ressource_version_conflict","error_description": "conflict on ressource " + req.params.id + " : Etag " + req.headers['if-none-match'] + " not matching"}]);
        }
        else if (err && err.status==204) {
        	//the document was existing
					return res.send(204);
        }
        else {
          sails.log.error(sails.config.errors["ERR_WHEN_DELETE"]);
        	return res.serverError(500, sails.config.errors["ERR_WHEN_DELETE"]);
        }
      });
   },



   swagger :function (req, res) {

     // Get the id parameter from the URI route
     if (req.params) {
       Ressource.getMapping(req, req.query , function (err, outputRessource) {
         if (err && err.error =="not_found") {
           // send a 404 Not Found
           return res.send(404, "{}");
         }
         else if (err) {
           ReportError.error(req,err,"ERR_500_0012");
           return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
         }
         else {
           var mapping = outputRessource[req.params.domain + '_' +req.params.model];
           // retrieve data to add to sample
           Ressource.findAll(req , function (err, outputRessource) {

             if (err && err.error =="not_found") {
               // send a 404 Not Found
               return res.send(404, "{}");
             }
             else if (err) {
               ReportError.error(req,err,"ERR_500_0013");
               return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
             }
             else {
               var mapping_text = JSON.stringify(mapping["mappings"][req.params.model]["properties"])
                   .replace(/\{/g,'{\n             ')
                   .replace(/\}\,/g, '\n             },\n             ')
                   .replace(/\}\,/g, '},\n             ')
                   .replace(/\}\}/g, '\n             }\n             }')
                   .replace(/"type"/g, '   "type"');
               res.type('application/x-yaml');
               return res.view('swagger.yaml.ejs', {
                  layout: '',
                  version: req.params.version,
                  domain: req.params.domain,
                  model: req.params.model,
                  baseUrl: req.baseUrl + '/',
                  sample_data: outputRessource[req.params.model][0],
                  mapping: mapping["mappings"][req.params.model]["properties"],
                  mapping_text: mapping_text
               });
             }
           }); // End Ressource.findAll
         }
       }); // End Ressource.getMapping
     }
     else {
       // it should nevever happen since this function should not be called without param
       return res.notFound("{}");
     }
  },

  postman :function (req, res) {

    // Get the id parameter from the URI route
    if (req.params) {
      Ressource.getMapping(req, req.query , function (err, outputRessource) {
        if (err && err.error =="not_found") {
          // send a 404 Not Found
          return res.send(404, "{}");
        }
        else if (err) {
          ReportError.error(req,err,"ERR_500_0014");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else {
          var mapping = outputRessource[req.params.domain + '_' +req.params.model];
          // retrieve data to add to sample
          Ressource.findAll(req , function (err, outputRessource) {

            if (err && err.error =="not_found") {
              // send a 404 Not Found
              return res.send(404, "{}");
            }
            else if (err) {
              ReportError.error(req,err,"ERR_500_00014");
              return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
            }
            else {
              var mapping_text = JSON.stringify(mapping["mappings"][req.params.model]["properties"])
                  .replace(/\{/g,'{\n             ')
                  .replace(/\}\,/g, '\n             },\n             ')
                  .replace(/\}\,/g, '},\n             ')
                  .replace(/\}\}/g, '\n             }\n             }')
                  .replace(/"type"/g, '   "type"');
            return res.view('postman.json.ejs', {
               layout: '',
               version: req.params.version,
               domain: req.params.domain,
               model: req.params.model,
               baseUrl: req.baseUrl + '/',
               sample_data: outputRessource[req.params.model][0],
               mapping: mapping["mappings"][req.params.model]["properties"],
               mapping_text: mapping_text
             });
           }
         }); // End Ressource.findAll
        }
      });
    }
    else {
        // it should nevever happen since this function should not be called without param
        return res.notFound("{}");
    }
 },

swagger_template   :function (req, res) {

    // Get the id parameter from the URI route
    req.params.model= "swagger";
    if (req.params) {
      Ressource.findOne(req, req.query , function (err, outputRessource) {
        if (err && err.error =="not_found") {
          // send a 404 Not Found
          return res.send(404, "{}");
        }
        else if (err) {
          ReportError.error(req,err,"ERR_500_0016");
          return res.send(500, sails.config.errors["ERR_UNKNOWN"]);
        }
        else {

          if (outputRessource.etag === req.headers['if-none-match'] && req.headers['if-none-match'] != null) {
            // The client has already the last version of the ressource : do'nt send document, only 304 Not modiied response
            return res.send(304);
          }
          else {
              //Send normal response
              res.setHeader("Etag", '"' +outputRessource.etag +'"');
              delete outputRessource.etag;
              delete outputRessource.creation_date;
              delete outputRessource.modification_date;
              delete outputRessource.id;
              return res.json(outputRessource);
          }
        }
      });
    }
    else {
        // it should nevever happen since this function should not be called without param
        return res.notFound("{}");
    }
  },


findOneSecondModel :function (req, res) {
  sails.log('controller:findOneSecondModel');

  //GET /:domain/:version/:model/:id/_:secondModel/:secondId
  //--> redirect GET /:domain/v0/:secondModel/_:secondId?model_id=id
  req.query["id_" + req.params.model] = req.params.id;
  req.params.id = req.params.secondId;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;

  this.findOne(req, res);
},

findAllSecondModel :function (req, res) {
  sails.log('controller:findAllSecondModel');

  //GET /:domain/:version/:model/:id/_:secondModel/
  //--> redirect GET /:domain/v0/:secondModel?model_id=id
  req.query["id_" + req.params.model] = req.params.id;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;
  this.findAll(req, res);
},

createSecondModel :function (req, res) {
  sails.log('controller:createSecondModel');

  req.query["id_" + req.params.model] = req.params.id;
  req.body["id_" + req.params.model] = req.params.id;
  delete req.params.id;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;
  this.create(req, res);
},

alterSecondModel :function (req, res) {
  sails.log('controller:alterSecondModel');

  req.query["id_" + req.params.model] = req.params.id;
  req.body["id_" + req.params.model] = req.params.id;
  req.body["id"] = req.params.secondId;
  req.params.id = req.params.secondId;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;
  this.alter(req, res);
},

alterOrCreateSecondModel :function (req, res) {
  sails.log('controller:alterOrCreateSecondModel');

  req.query["id_" + req.params.model] = req.params.id;
  req.body["id_" + req.params.model] = req.params.id;
  req.body["id"] = req.params.secondId;
  req.params.id = req.params.secondId;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;
  this.alterOrCreate(req, res);
},
deleteSecondModel :function (req, res) {
  sails.log('controller:deleteSecondModel');

  req.query["id_" + req.params.model] = req.params.id;
  req.params.id = req.params.secondId;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;
  this.deleteOne(req, res);
},
searchSecondModel :function (req, res) {
  sails.log('controller:searchSecondModel');

  req.query["id_" + req.params.model] = req.params.id;
  req.params.id = req.params.secondId;
  req.params.model = req.params.secondModel;
  req.params.version = 'v0';//v0 is always the last version
  req.params.domain = req.params.domain;
  this.search(req, res);
}



};
