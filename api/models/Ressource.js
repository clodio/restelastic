var elasticsearch = require('elasticsearch');
var uuid = require('uuid');
var shortid = require('shortid');
var crypto = require('crypto');
var esclient = new elasticsearch.Client(sails.config.connections.someElasticsearchServer);

/**
* Ressource.js
*
* @description :: Ressource model .
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	//Fill me please

  },

  // FindOne methods
  findOne: function findOne (req, query, cb){
    sails.log('findOne:model');

    // create the DSL Query for elastic search
    var DSLQuery = {
        index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
        type: req.params.model.toLowerCase(),
        id: req.params.id
      }; //Query Send to ElasticSearch
    var DSLQueryFields = []; //Fields to be returned by ElasticSearch
    if (query.fields) {
        // Add Fields filter with _source to DSL Query   : http://www.elasticsearch.org/guide/en/elasticsearch/reference/1.x/search-request-source-filtering.html
        var queryFieldsTmp = query.fields.split(",");
        for(i in queryFieldsTmp) {
            DSLQueryFields.push(queryFieldsTmp[i]);
        }
				DSLQuery["_source"] = DSLQueryFields;
    }


    // execute the DSL Query
    esclient.get(DSLQuery, function (error, response) {
      if (response && response.found==false) {
        cb(sails.config.errors["NOT_FOUND"]);
      }
      else if (error) {
        ReportError.error(req,error,"ERR_internal_2000");
        cb(sails.config.errors["ERR_WHEN_RETRIEVING"]);
      }
     else {
     		//ressource found, add version ressource etag from elasticsearch tattribute _version
     		response._source.etag=response._version.toString();
        cb(null, response._source);
     }
    });
  },






  // findAll
  findAll: function findAll (req, cb){
  sails.log('findAll:model');

      var DSLQuery = "";
      var DSLQuery = {};
      var DSLQueryFilter = {};
      var DSLQueryFilterMatch = {};
      var DSLQueryFilterRange = [];
      var DSLQueryFilterMust = [];
      var DSLQueryFilterMustNot = [];
      var DSLQueryFilterShould = [];
      var DSLQueryFields = [];
      var DSLQueryFrom = 0; //first item to send from Elasticsearch for paginate (start_index equivalent)
      var DSLQuerySize= sails.config.blueprints.defaultLimit || 30; //number of items to send from Elasticsearch for paginate (count equivalent)
      var DSLQuerySizeMax = sails.config.blueprints.maxLimit || 1000;//max number of item to return for paginate

      var queryString=[];
      var isFieldsEtagPresent=false; //check if etag is in output fields

			// paginate
			if (req.query.start_index) {
					//elasticsearch start at 0 but start_index start at 1
					DSLQueryFrom = Number(req.query.start_index) -1;
			}
			if (req.query.count) {
					//number of items
					if (req.query.count >DSLQuerySizeMax) {
						//TODO cb({"error":"count > limit " + DSLQuerySizeMax}, null);
					}
					DSLQuerySize = Math.min(req.query.count,DSLQuerySizeMax);
			}


    // create the DSL Query
      for(var queryrParameter in req.query) {

				if (queryrParameter !== "start_index" && queryrParameter !== "count") {

					//generate the querytring for pagintage link
					if (queryString !=="") {queryString =queryString +"&"}
					queryString=queryString + queryrParameter + "=" + req.query[queryrParameter];

          if (queryrParameter !== "fields") {
              // Add filter to DSL Query

              //@TODO refactor
              var rangeParameterFound = false;
              var pos = queryrParameter.indexOf("_gte");
              if (pos > 0  && queryrParameter.length == pos+ 4) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                var DSLQueryFilterRangeTmp= {"range" : {}};
                DSLQueryFilterRangeTmp["range"][queryrParameter]={"gte":  value  };
                DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
              }
              var pos = queryrParameter.indexOf("_gt");
              if (pos > 0  && queryrParameter.length == pos+ 3) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                var DSLQueryFilterRangeTmp= {"range" : {}};
                DSLQueryFilterRangeTmp["range"][queryrParameter]={"gt":  value  };
                DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
              }
              var pos = queryrParameter.indexOf("_lte");
              if (pos > 0  && queryrParameter.length == pos+ 4) {
                rangeParameterFound=true;

                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                var DSLQueryFilterRangeTmp= {"range" : {}};
                DSLQueryFilterRangeTmp["range"][queryrParameter]={"lte":  value  };
                DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
              }
              var pos = queryrParameter.indexOf("_lt");
              if (pos > 0  && queryrParameter.length == pos+ 3) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                var DSLQueryFilterRangeTmp= {"range" : {}};
                DSLQueryFilterRangeTmp["range"][queryrParameter]={"lt":  value  };
                DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
              }
              var pos = queryrParameter.indexOf("_ne");
              if (pos > 0 && queryrParameter.length == pos+ 3) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                value = value.toString().split(",");
                for (var i in value) {
                  var DSLQueryFilterMustNotTmp= {"term" : {}};
                  DSLQueryFilterMustNotTmp["term"][queryrParameter]=value[i].toLowerCase();
                  DSLQueryFilterMustNot.push(DSLQueryFilterMustNotTmp);
                }
              }
              var pos = queryrParameter.indexOf("_like");
              if (pos > 0 && queryrParameter.length == pos+ 5) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                value = value.toString().split(",");
                for (var i in value) {
                  var DSLQueryFilterLikeTmp= {"wildcard" : {}};
                  DSLQueryFilterLikeTmp["wildcard"][queryrParameter]=value[i].toLowerCase();
                  DSLQueryFilterMust.push(DSLQueryFilterLikeTmp);
                }
              }
              var pos = queryrParameter.indexOf("_prefix");
              if (pos > 0 && queryrParameter.length == pos+ 7) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                value = value.toString().split(",");
                for (var i in value) {
                  var DSLQueryFilterPrefixTmp= {"prefix" : {}};
                  DSLQueryFilterPrefixTmp["prefix"][queryrParameter]=value[i].toLowerCase();
                  DSLQueryFilterMust.push(DSLQueryFilterPrefixTmp);
                }
              }
              var pos = queryrParameter.indexOf("_regex");
              if (pos > 0 && queryrParameter.length == pos+ 6) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                value = value.toString().split(",");
                for (var i in value) {
                  var DSLQueryFilterRegexTmp= {"regexp" : {}};
                  DSLQueryFilterRegexTmp["regexp"][queryrParameter]=value[i].toLowerCase();
                  DSLQueryFilterMust.push(DSLQueryFilterRegexTmp);
                }
              }
              var pos = queryrParameter.indexOf("_fuzzy");
              if (pos > 0 && queryrParameter.length == pos+ 6) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                value = value.toString().split(",");
                for (var i in value) {
                  var DSLQueryFilterFuzzyTmp= {"fuzzy" : {}};
                  DSLQueryFilterFuzzyTmp["fuzzy"][queryrParameter]=value[i].toLowerCase();
                  DSLQueryFilterMust.push(DSLQueryFilterFuzzyTmp);
                }
              }
              var pos = queryrParameter.indexOf("_exists");
              if (pos > 0 && queryrParameter.length == pos+ 7) {
                rangeParameterFound=true;
                var value = req.query[queryrParameter];
                delete req.query[queryrParameter];
                queryrParameter=queryrParameter.substring(0,pos);
                value = value.toString().split(",");
                for (var i in value) {
                  if (value[i].toLowerCase()=="true") {
                    var DSLQueryFilterExistTmp= {"exists" : {}};
                    DSLQueryFilterExistTmp["exists"]["field"]=queryrParameter;
                    DSLQueryFilterMust.push(DSLQueryFilterExistTmp);
                  }
                  else {
                    var DSLQueryFilterMustNotTmp= {"exists" : {}};
                    DSLQueryFilterMustNotTmp["exists"]["field"]=queryrParameter;
                    DSLQueryFilterMustNot.push(DSLQueryFilterMustNotTmp);
                  }
                }
              }

              if (rangeParameterFound == false) {
                //if (!DSLQueryFilterMatch.term) {DSLQueryFilterMatch.term={};}
                //DSLQueryFilterMatch["term"][queryrParameter]=req.query[queryrParameter].toLowerCase();
                var value = req.query[queryrParameter].toString().split(",");
                if (value.length>1) {
                  for (var i in value) {
                    var DSLQueryFilterShouldTmp= {"term" : {}};
                    //@todo test lowercase, uppercase, accents
                    DSLQueryFilterShouldTmp["term"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterShould.push(DSLQueryFilterShouldTmp);
                  }
                }
                else {
                  for (var i in value) {
                    var DSLQueryFilterMustTmp= {"term" : {}};
                    //@todo test lowercase, uppercase, accents
                    DSLQueryFilterMustTmp["term"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterMust.push(DSLQueryFilterMustTmp);
                  }
                }

              }
          }
          else {
              // Add Fields filter with _source to DSL Query   : http://www.elasticsearch.org/guide/en/elasticsearch/reference/1.x/search-request-source-filtering.html
              var queryFieldsTmp = req.query[queryrParameter].split(",");
              for(i in queryFieldsTmp) {
              		if (queryFieldsTmp[i]=="etag") {
              			isFieldsEtagPresent=true;
              		}
                  DSLQueryFields.push(queryFieldsTmp[i]);
              }
          }
        }
      }
     	if (DSLQueryFilterMust==[] && DSLQueryFilterMustNot==[]) {
     		//no filter : send all
        DSLQueryFilter = {
        		match_all: {}
        };
      }
      else {

        DSLQueryFilter = {
        		"constant_score": {
        			"filter": {
        				"bool": {
        				}
        			}
        		}
        };
        if (DSLQueryFilterMust !=[]) {
          DSLQueryFilter["constant_score"]["filter"]["bool"]["must"]=DSLQueryFilterMust;
        }
        if (DSLQueryFilterMustNot !=[]) {
          DSLQueryFilter["constant_score"]["filter"]["bool"]["must_not"]=DSLQueryFilterMustNot;
        }
        if (DSLQueryFilterShould !=[]) {
          DSLQueryFilter["constant_score"]["filter"]["bool"]["should"]=DSLQueryFilterShould;
        }
      }


      DSLQuery = {
         index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
         type: req.params.model.toLowerCase(),
         body: {
           query: DSLQueryFilter,
           size: DSLQuerySize,
           from: DSLQueryFrom
         }
      };

			if (isFieldsEtagPresent || DSLQueryFields.length==0) {
				//ask for version (future etag) when etag is in the query or when there is no filter
				//todo bench performance test always ask for version may be not a performance problem
        DSLQuery["version"] = true;
			}
			else{
				DSLQuery["body"]["_source"] = {include: DSLQueryFields};
			}

    // execute the DSL Query
    esclient.search(DSLQuery, function (error, response) {

          if (error && error.message =="No Living connections") {
            ReportError.error(req,error,"ERR_internal_1000");
            cb(sails.config.errors["ERR_WITH_DATABASE"]);
          }
          else if (error && error.message !="Unable to parse/serialize body" && error.message.indexOf("index_not_found_exception") >0) {
            //this is not really an error, the user may call a ressource that not exists
            cb({"error": "index_not_found","error_description": "Unable to find index of the ressource" });
          }
          else if (error && error.message !="Unable to parse/serialize body") {
            ReportError.error(req,error,"ERR_internal_1001");
            cb(sails.config.errors["ERR_WHEN_EXECUTE"]);
          }
          else if (error ) {
            ReportError.error(req,error,"ERR_internal_1002");
            cb(sails.config.errors["ERR_WITH_DATABASE"]);
          }
          else {
						var collectionOutput={};
            var dataOutput=[];
            for (i in response.hits.hits) {
            	  if (response.hits.hits[i]._version) {
            			response.hits.hits[i]._source.etag = response.hits.hits[i]._version;
            		}
                dataOutput.push(response.hits.hits[i]._source);
            }
            collectionOutput[req.params.model] = dataOutput;
            collectionOutput.paging = {};

            // Add hits nubmer in pagination
            collectionOutput.paging.total_results =response.hits.total;

            // Add pagination link
            if (DSLQueryFrom>0 && response.hits.total>0) {
            	var minIndex= Math.max(Number(DSLQueryFrom)+1 - Number(DSLQuerySize),1);
            	collectionOutput.paging.prev= req.protocol + "://" + req.headers.host +  req.path+ "?start_index="  + minIndex + "&count=" + DSLQuerySize + queryString;
            }

            var maxIndex= Number(DSLQueryFrom) + Number(DSLQuerySize) +1;
            if (maxIndex < response.hits.total && response.hits.total>0) {
            	collectionOutput.paging.next= req.protocol + "://" + req.headers.host +  req.path + "?start_index="  + maxIndex + "&count=" + DSLQuerySize  + queryString;
            }
            cb(null, collectionOutput);
            }
     });
  },




  // search
  search: function search (req, cb){
    sails.log('search:model');

      var DSLQuery = "";
      var DSLQuery = {};
      var DSLQueryFilter = {};
      var DSLQueryFilterMatch = {};
      var DSLQueryFilterRange = [];
      var DSLQueryFilterMust = [];
      var DSLQueryFilterMustNot = [];
      var DSLQueryFilterShould = [];
      var DSLQueryFields = [];
      var DSLQueryFrom = 0; //first item to send from Elasticsearch for paginate (start_index equivalent)
      var DSLQuerySize = sails.config.blueprints.defaultLimit || 30 ; //number of items to send from Elasticsearch for paginate (count equivalent)
      var DSLQuerySizeMax = sails.config.blueprints.maxLimit || 1000;//max number of item to return for paginate

      var queryString=[];
      var isFieldsEtagPresent=false; //check if etag is in output fields

      // paginate
      if (req.query.start_index) {
          //elasticsearch start at 0 but start_index start at 1
          DSLQueryFrom = Number(req.query.start_index) -1;
      }
      if (req.query.count) {
          //number of items
          if (req.query.count >DSLQuerySizeMax) {
            //TODO cb({"error":"count > limit " + DSLQuerySizeMax}, null);
          }
          DSLQuerySize = Math.min(req.query.count,DSLQuerySizeMax);
      }


      // create the DSL Query
        for(var queryrParameter in req.query) {

  				if (queryrParameter !== "start_index" && queryrParameter !== "count") {

  					//generate the querytring for pagintage link
  					if (queryString !=="") {queryString =queryString +"&"}
  					queryString=queryString + queryrParameter + "=" + req.query[queryrParameter];

            if (queryrParameter !== "fields") {
                // Add filter to DSL Query

                /* ajout CSE */
                //@TODO refactor
                var rangeParameterFound = false;
                var pos = queryrParameter.indexOf("_gte");
                if (pos > 0  && queryrParameter.length == pos+ 4) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  var DSLQueryFilterRangeTmp= {"range" : {}};
                  DSLQueryFilterRangeTmp["range"][queryrParameter]={"gte":  value  };
                  DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
                }
                var pos = queryrParameter.indexOf("_gt");
                if (pos > 0  && queryrParameter.length == pos+ 3) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  var DSLQueryFilterRangeTmp= {"range" : {}};
                  DSLQueryFilterRangeTmp["range"][queryrParameter]={"gt":  value  };
                  DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
                }
                var pos = queryrParameter.indexOf("_lte");
                if (pos > 0  && queryrParameter.length == pos+ 4) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  var DSLQueryFilterRangeTmp= {"range" : {}};
                  DSLQueryFilterRangeTmp["range"][queryrParameter]={"lte":  value  };
                  DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
                }
                var pos = queryrParameter.indexOf("_lt");
                if (pos > 0  && queryrParameter.length == pos+ 3) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  var DSLQueryFilterRangeTmp= {"range" : {}};
                  DSLQueryFilterRangeTmp["range"][queryrParameter]={"lt":  value  };
                  DSLQueryFilterMust.push(DSLQueryFilterRangeTmp);
                }
                var pos = queryrParameter.indexOf("_ne");
                if (pos > 0 && queryrParameter.length == pos+ 3) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  value = value.toString().split(",");
                  for (var i in value) {
                    var DSLQueryFilterMustNotTmp= {"term" : {}};
                    DSLQueryFilterMustNotTmp["term"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterMustNot.push(DSLQueryFilterMustNotTmp);
                  }
                }
                var pos = queryrParameter.indexOf("_like");
                if (pos > 0 && queryrParameter.length == pos+ 5) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  value = value.toString().split(",");
                  for (var i in value) {
                    var DSLQueryFilterLikeTmp= {"wildcard" : {}};
                    DSLQueryFilterLikeTmp["wildcard"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterMust.push(DSLQueryFilterLikeTmp);
                  }
                }
                var pos = queryrParameter.indexOf("_prefix");
                if (pos > 0 && queryrParameter.length == pos+ 7) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  value = value.toString().split(",");
                  for (var i in value) {
                    var DSLQueryFilterPrefixTmp= {"prefix" : {}};
                    DSLQueryFilterPrefixTmp["prefix"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterMust.push(DSLQueryFilterPrefixTmp);
                  }
                }
                var pos = queryrParameter.indexOf("_regex");
                if (pos > 0 && queryrParameter.length == pos+ 6) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  value = value.toString().split(",");
                  for (var i in value) {
                    var DSLQueryFilterRegexTmp= {"regexp" : {}};
                    DSLQueryFilterRegexTmp["regexp"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterMust.push(DSLQueryFilterRegexTmp);
                  }
                }
                var pos = queryrParameter.indexOf("_fuzzy");
                if (pos > 0 && queryrParameter.length == pos+ 6) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  value = value.toString().split(",");
                  for (var i in value) {
                    var DSLQueryFilterFuzzyTmp= {"fuzzy" : {}};
                    DSLQueryFilterFuzzyTmp["fuzzy"][queryrParameter]=value[i].toLowerCase();
                    DSLQueryFilterMust.push(DSLQueryFilterFuzzyTmp);
                  }
                }
                var pos = queryrParameter.indexOf("_exists");
                if (pos > 0 && queryrParameter.length == pos+ 7) {
                  rangeParameterFound=true;
                  var value = req.query[queryrParameter];
                  delete req.query[queryrParameter];
                  queryrParameter=queryrParameter.substring(0,pos);
                  value = value.toString().split(",");
                  for (var i in value) {
                    if (value[i].toLowerCase()=="true") {
                      var DSLQueryFilterExistTmp= {"exists" : {}};
                      DSLQueryFilterExistTmp["exists"]["field"]=queryrParameter;
                      DSLQueryFilterMust.push(DSLQueryFilterExistTmp);
                    }
                    else {
                      var DSLQueryFilterMustNotTmp= {"exists" : {}};
                      DSLQueryFilterMustNotTmp["exists"]["field"]=queryrParameter;
                      DSLQueryFilterMustNot.push(DSLQueryFilterMustNotTmp);
                    }
                  }
                }

                if (rangeParameterFound == false) {
                  //if (!DSLQueryFilterMatch.term) {DSLQueryFilterMatch.term={};}
                  //DSLQueryFilterMatch["term"][queryrParameter]=req.query[queryrParameter].toLowerCase();
                  var value = req.query[queryrParameter].toString().split(",");
                  if (value.length>1) {
                    for (var i in value) {
                      var DSLQueryFilterShouldTmp= {"term" : {}};
                      //@todo test lowercase, uppercase, accents
                      DSLQueryFilterShouldTmp["term"][queryrParameter]=value[i].toLowerCase();
                      DSLQueryFilterShould.push(DSLQueryFilterShouldTmp);
                    }
                  }
                  else {
                    for (var i in value) {
                      var DSLQueryFilterMustTmp= {"term" : {}};
                      //@todo test lowercase, uppercase, accents
                      DSLQueryFilterMustTmp["term"][queryrParameter]=value[i].toLowerCase();
                      DSLQueryFilterMust.push(DSLQueryFilterMustTmp);
                    }
                  }

                }
            }
            else {
                // Add Fields filter with _source to DSL Query   : http://www.elasticsearch.org/guide/en/elasticsearch/reference/1.x/search-request-source-filtering.html
                var queryFieldsTmp = req.query[queryrParameter].split(",");
                for(i in queryFieldsTmp) {
                		if (queryFieldsTmp[i]=="etag") {
                			isFieldsEtagPresent=true;
                		}
                    DSLQueryFields.push(queryFieldsTmp[i]);
                }

            }
          }
        }




      if (DSLQueryFilterMust==[] && DSLQueryFilterMustNot==[]) {
        //no filter : send all
        DSLQueryFilter = {
            match_all: {}
        };
      }
      else{

        DSLQueryFilter = {
            "constant_score": {
              "filter": {
                "bool": {
                }
              }
            }
        };
        if (DSLQueryFilterMust !=[]) {
          DSLQueryFilter["constant_score"]["filter"]["bool"]["must"]=DSLQueryFilterMust;
        }
        if (DSLQueryFilterMustNot !=[]) {
          DSLQueryFilter["constant_score"]["filter"]["bool"]["must_not"]=DSLQueryFilterMustNot;
        }
        if (DSLQueryFilterShould !=[]) {
          DSLQueryFilter["constant_score"]["filter"]["bool"]["should"]=DSLQueryFilterShould;
        }
      }


      DSLQuery = {
         index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
         type: req.params.model.toLowerCase(),
         q:  req.query.q + '*',
         body: {
           query: DSLQueryFilter,
           size: DSLQuerySize,
           from: DSLQueryFrom
         }
      };





      if (isFieldsEtagPresent || DSLQueryFields.length==0) {
        //ask for version (future etag) when etag is in the query or when there is no filter
        //todo bench performance test always ask for version may be not a performance problem
          DSLQuery["version"] = true;
      }
      else{
          DSLQuery["body"]["_source"] = {include: DSLQueryFields};

      }

    // execute the DSL Query
    esclient.search(DSLQuery, function (error, response) {
          if (response && response.found==false) {
            cb({"error":"not found"});
          }
          else if (error) {
            ReportError.error(req,error,"ERR_internal_1011");
            cb(sails.config.errors["ERR_WHEN_RETRIEVING"]);
          }
          else {
            var collectionOutput={};
            var dataOutput=[];
            for (i in response.hits.hits) {
                if (response.hits.hits[i]._version) {
                  response.hits.hits[i]._source.etag = response.hits.hits[i]._version;
                }
                dataOutput.push(response.hits.hits[i]._source);
            }
            collectionOutput[req.params.model] = dataOutput;
            collectionOutput.paging = {};

            // Add hits nubmer in pagination
            collectionOutput.paging.total_results =response.hits.total;

            // Add pagination link
            if (DSLQueryFrom>0 && response.hits.total>0) {
              var minIndex= Math.max(Number(DSLQueryFrom)+1 - Number(DSLQuerySize),1);
              collectionOutput.paging.prev= req.protocol + "://" + req.headers.host +  req.path+ "?start_index="  + minIndex + "&count=" + DSLQuerySize + queryString;
            }

            var maxIndex= Number(DSLQueryFrom) + Number(DSLQuerySize) +1;
            if (maxIndex < response.hits.total && response.hits.total>0) {
              collectionOutput.paging.next= req.protocol + "://" + req.headers.host +  req.path + "?start_index="  + maxIndex + "&count=" + DSLQuerySize  + queryString;
            }

            cb(null, collectionOutput);
            }
     });
  },












  alter: function (req, cb){

		req.body.id = req.params.id;

		//if there is no modification_date add it
    currentDate = new Date().toISOString().replace(/\..+/, '') + "Z";
    if (!req.body.modification_date) {
    	req.body.modification_date = currentDate;
    }

    var DSLQuery ={
      index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
      consistency: 'quorum',
      retry_on_conflict:3,
      version: req.headers['if-none-match'],
      type: req.params.model.toLowerCase(),
      id: req.params.id,
      body: {
        doc : req.body
      }
    };

    //todo chnage the entry to have etag headers
		if (req.headers['if-none-match']) {
			//etag is send by the client : check if ressource in  the database is the same as the client
      DSLQuery['version']= req.headers['if-none-match'];
      // elastic : Validation Failed: 1: can\u0027t provide both retry_on_conflict and a specific version;
      delete DSLQuery.retry_on_conflict;
		}

    // execute the DSL Query
    esclient.update(DSLQuery, function (error, response) {
      if (error && response != undefined) {

        if (error && response.status==409) {
          cb(sails.config.errors["CONFLICT"]);
        }
        else if (error && response.status==400) {
          cb({"error": "wrong_arguments","error_description": response.error.root_cause[0].reason});
        }
        else if (error && error.status==404) {
          cb(sails.config.errors["NOT_FOUND"]);
        }
      }
      else if (error) {
        ReportError.error(req,error,"ERR_internal_1010");
        cb(sails.config.errors["ERR_WHEN_RETRIEVING"]);
      }
      else {
        // the ressource has been updated, retrieve it
        req.params.id= response._id;
      	Ressource.findOne (req, {} , function (err, outputResponse) {
      		//todo : add error test
          cb(err,outputResponse);
      	});
      }
    });
  },




  create: function (req, body, cb){

		// Generate random id based from uuid
		if (!body.id) {
    	//shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    	var randomId =shortid.generate();
    	randomId=randomId.replace('_', 'A');
    	randomId=randomId.replace('-', 'b');

      //@TODO : generate an external function
      var consonnes = ['b','c','d','f','g','j','k','l','m','n','p','r','s','t','v','x','z'];
      var voyelles = ['a', 'e', 'i', 'o', 'u'];
      var desChiffresEtDesLettres = consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] + consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] +consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] + ('00' +Math.floor(Math.random() * 100)).slice(-3);
      randomId = desChiffresEtDesLettres + randomId;

      body.id=randomId;
      req.params.id = body.id;

    }


		//if there is no creation_date or modification_date add them
    currentDate = new Date().toISOString().replace(/\..+/, '') + "Z";

		if (!body.creation_date) {
    	body.creation_date = currentDate;
    }
    if (!body.modification_date) {
    	body.modification_date = currentDate;
    }

    var DSLQuery ={
			index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
			type: req.params.model.toLowerCase(),
			retry_on_conflict: 3,
			consistency: 'quorum',
			id: req.params.id,
			body: JSON.stringify(body)
		};

    // execute the DSL Query
    esclient.create(DSLQuery, function (error, response) {
      if (error && response != undefined) {

        if (error && response.status==409) {
            cb(sails.config.errors["CONFLICT"]);
        }
        else if (error && response.status==400) {
          cb({"error": "wrong_arguments","error_description": response.error.root_cause[0].reason});
        }
        else if (error) {
          ReportError.error(req,error,"ERR_internal_1003");
          cb(sails.config.errors["ERR_WHEN_CREATE"]);
        }
      }
      else if (error) {
        ReportError.error(req,error,"ERR_internal_1000");
        cb(sails.config.errors["ERR_WHEN_CREATE"]);
      }
      else {
        if (response) {
          req.params.id= response._id;
          Ressource.findOne (req, {} , function (err, outputResponse) {
            //todo : add error test
            if (error) {
              ReportError.error(req,error,"ERR_internal_1004");
              cb(sails.config.errors["ERR_WHEN_RETRIEVING"]);
            }
            else {
              cb(err, outputResponse);
            }
          });
        }
        else {
          ReportError.error(req,error,"ERR_internal_1005");
          cb(sails.config.errors["ERR_NO_RESPONSE_WHEN_CREATE"]);
        }
      }
    });

  },

  fullUpdate: function (req, body, cb){
    //same as create but call es.index instead of es.create

		// Generate random id based from uuid
		if (!body.id) {
    	//shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    	var randomId =shortid.generate();
    	randomId=randomId.replace('_', 'A');
    	randomId=randomId.replace('-', 'b');

      //@TODO : generate an external function
      var consonnes = ['b','c','d','f','g','j','k','l','m','n','p','r','s','t','v','x','z'];
      var voyelles = ['a', 'e', 'i', 'o', 'u'];
      var desChiffresEtDesLettres = consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] + consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] +consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] + ('00' +Math.floor(Math.random() * 100)).slice(-3);
      randomId = desChiffresEtDesLettres + randomId;

      body.id=randomId;
      req.params.id = body.id;

    }


		//if there is no creation_date or modification_date add them
    currentDate = new Date().toISOString().replace(/\..+/, '') + "Z";

		if (!body.creation_date) {
    	body.creation_date = currentDate;
    }
    if (!body.modification_date) {
    	body.modification_date = currentDate;
    }

    var DSLQuery ={
			index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
			type: req.params.model.toLowerCase(),
			retry_on_conflict: 3,
			consistency: 'quorum',
			id: req.params.id,
			body: JSON.stringify(body)
		};

    // execute the DSL Query
    esclient.index(DSLQuery, function (error, response) {
      if (error && response.status==409) {
        cb(sails.config.errors["CONFLICT"]);
      }
      else if (error && response.status==400) {
        cb({"error": "wrong_arguments","error_description": response.error.root_cause[0].reason});
      }
      else if (error) {
        ReportError.error(req,error,"ERR_internal_1006");
        cb(sails.config.errors["ERR_WHEN_RETRIEVING"]);
      }
      else {
        if (response) {
          req.params.id= response._id;
          Ressource.findOne (req, {} , function (err, outputResponse) {
            //todo : add error test
            if (error) {
              ReportError.error(req,error,"ERR_internal_1007");
              cb(sails.config.errors["ERR_WHEN_RETRIEVING"]);
            }
            else {
              cb(err, outputResponse);
            }
          });
        }
        else {
          ReportError.error(req,error,"ERR_internal_1008");
          cb(sails.config.errors["ERR_NO_RESPONSE_WHEN_CREATE"]);
        }
      }
    });

  },



  deleteOne: function deleteOne (req, cb){
    sails.log('deleteOne:model');

    // create the DSL Query
    var DSLQuery = '';

    DSLQuery={
		  index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
		  type: req.params.model.toLowerCase(),
		  id: req.params.id
		};

		//check Etag if provided
		if (req.headers['if-none-match']) {
			DSLQuery.version=req.headers['if-none-match'];
		}

    esclient.delete(DSLQuery, function (error, response) {

				if (response && response.found==false) {
				  cb(sails.config.errors["NOT_FOUND"]);
				}
				else if (response && response.status==409) {
				  cb(sails.config.errors["CONFLICT"]);
				}
				else if (error) {
          ReportError.error(req,error,"ERR_delete_1000");
				 	cb(sails.config.errors["ERR_WHEN_EXECUTE"]);
				}
				else {
					//delete OK
				  cb({"status":204});
				}
		});
  },


  // FindOne methods
  getMapping: function getMapping (req, query, cb){
    sails.log('getMapping:model');

    // create the DSL Query for elastic search
    var DSLQuery = {
        index: req.params.domain.toLowerCase() + '_' + req.params.model.toLowerCase(),
        type: req.params.model.toLowerCase(),
      }; //Query Send to ElasticSearch


    // execute the DSL Query
    esclient.indices.getMapping(DSLQuery, function (error, response) {
      if (error) {
        ReportError.error(req,error,"ERR_getMapping_1000");
        cb(sails.config.errors["ERR_WHEN_EXECUTE"]);
      }
     else {
        //response._source.etag=response._version.toString();
        cb(null, response);
     }
    });
  }








};
