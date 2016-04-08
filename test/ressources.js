// Add particular jshint config to the test file //
/*jshint expr: true*/
/*jshint maxlen: 200*/
var chai = require('chai');

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');

var net = require('net');
var dns = "http://localhost:1337";
var dns_elasticsearch = "http://localhost:9200";

function randomValue () {
	var letters = ['a', 'e', 'i', 'o', 'u', 'b','c','d','f','g','j','k','l','m','n','p','r','s','t','v','x','z'];
	var randomValue = letters[Math.floor(Math.random() * 20)] +letters[Math.floor(Math.random() * 20)] +letters[Math.floor(Math.random() * 20)]+letters[Math.floor(Math.random() * 20)];
	return randomValue;
}

describe('ModelAPI', function(){

		before(function() {

			// delete datas
			var url = dns_elasticsearch + '/sample_users';
			//request.del({url: url, rejectUnauthorized: false, json: true}, function (err, res, body) {
			//	 if (err) {console.log(err);}
			//});

		 	var body ={
			  "settings" : {
			  "number_of_shards" : 1,
			  "number_of_replicas" : 1
			  }
			};
			request.put({url: url,body:body, rejectUnauthorized: false, json: true}, function (err, res, body) {
				 if (err) {console.log(err);}
			});

			body ={
		  "users": {
		    "_timestamp": {},
		    "properties": {
		      "address": {
		        "properties": {
		          "locality": {
		          	"type": "string"
		          },
		          "postal_code": {
		          	"type": "string"
		          }
		        }
		      },
		      "creation_date": {
		      	"type": "date",
		      	"format": "epoch_millis||dateOptionalTime"
		      },
		      "etag": {
		      	"type": "string"
		      },
		      "hierarchical": {
		      	"properties": {
		      		"data": {
		      			"type": "string"
		      		}
		      	}
		      },
		      "id": {
		      	"type": "string"
		      },
		      "is_vip": {
		      	"type": "boolean"
		      },
		      "mail": {
		      	"type": "string"
		      },
		      "modification_date": {
		      	"type": "date",
		      	"format": "epoch_millis||dateOptionalTime"
		      },
		      "name": {
		      	"type": "string"
		      },
		      "need_to_disapear_in_few_test": {
		      	"type": "string"
		      },
		      "new": {
		      	"type": "long"
		      },
		      "numeric": {
		      	"type": "long"
		      },
		      "password": {
		      	"type": "string"
		      },
		      "pwd": {
		      	"type": "string"
		      },
		      "status": {
		      	"type": "string"
		      },
		      "value": {
		      	"type": "string"
		      },
		      "votes": {
		      	"type": "integer"
		      }
		    }
		  }
		};
		 url = dns_elasticsearch + '/sample_users/_mapping/users';
		 request.put({url: url,body:body, rejectUnauthorized: false, json: true}, function (err, res, body) {
		 	 if (err) {console.log(err);}
		 });

			//generate dataset for the tests
			url = dns + '/sample/v1/users/0008WJPog';

			//note : this data is used to tests etag, delete then create do not reinitialise the etag so we do create if not exist
			request.get({url: url, rejectUnauthorized: false, json: true, headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) {
					if (err) {
					console.log(err);
				}
				else if (!err && res.statusCode==404) {
					var url = dns + '/sample/v1/users/0008WJPog';
					var body = {id:'0008WJPog', name:'unittest00', mail: 'unittest00@unknownmail.com', pwd: 'mypassword', votes:13, is_vip:true, address: {postal_code:'07340', locality:'Félines'}};

					request.put({url: url, body: body, rejectUnauthorized: false, json: true,headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) {
						 console.log("ghhghghghg");if (err) {console.log(err);} });
				}
			});

			url = dns + '/sample/v1/users/1117WJPog';
			var body = {id:'1117WJPog', name:'unittest01', mail: 'unittest01@unknownmail.com', pwd: 'mypassword', votes:18, is_vip:true};
			request.put({url: url, body: body, rejectUnauthorized: false, json: true,headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) {
				 if (err) {console.log(err);} });

			url = dns + '/sample/v1/users/2227PogWJ';
			body = {id:'2227PogWJ', name:'unittest02', mail: "unittest02@unknownmail.com", pwd: "mypassword", votes:123, is_vip:true};
			request.put({url: url, body: body,rejectUnauthorized: false, json: true, headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) { if (err) {console.log(err);} });

			url = dns + '/sample/v1/users/3337PogWJ';
			body = {id:'3337PogWJ', name:'clodio', mail: "clodio@unknownmail.com", pwd: "mypassword", votes:1805, is_vip:false};
			request.put({url: url, body: body,rejectUnauthorized: false, json: true, headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) { if (err) {console.log(err);} });


			url = dns + '/sample/v1/users/to_delete1';
			body = {id:'to_delete1', name:'to_delete1_name', votes:123456, is_vip:true};
			request.put({url: url, body: body, rejectUnauthorized: false, json: true,headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) {
					 if (err) {console.log(err);}
			});

			url = dns + '/sample/v1/users/to_delete2';
			body = {id:'to_delete2', name:'to_delete2_name', votes:123456, is_vip:true};
			request.put({url: url, body: body, rejectUnauthorized: false, json: true,headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) {
					 if (err) {console.log(err);}
			});

			var i;
			for (i = 1; i < 31; i++) {
				url = dns + '/sample/v1/users/' + i;
				body = {id:i, name:'test' +i, mail: 'test' + i + '@unknownmail.com', pwd: 'mypassword', votes:i, is_vip:true};
				request.put({url: url, body: body,rejectUnauthorized: false, json: true, headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}}, function (err, res, body) {if (err) {console.log(err);} });
			}
		})





	 describe('GET UNIQUE /sample/v1/users/:id', function(){

		 it('should start', function (done) {
		 	var options = {
		 			timeout: 4000,
		 			url: dns + '/sample/v1/users/0008WJPog',
		 			rejectUnauthorized: false,
		 			headers: {
		 					'Accept-Encoding' : 'gzip',
		 					'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
		 			json: true
		 	};
		 	//unexpected error
		 		var expectedResult = {};
		 	request(options, function (error, response, body){
		 		if (error) {console.log('error:' + error);}

		 		done();
		 	});
		 });

		it('should return a http code 404 when id is unknown', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/unknown_id',
			    rejectUnauthorized: false,
					headers: {
							'Accept-Encoding' : 'gzip',
							'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(404);
	    	expect(JSON.stringify(body)).to.equal('{}');
	    	done();
	  	});
		});



    it('should return a http code 200 and a body when id exists', function (done) {
	  	var options = {
					timeout: 4000,
			    url: dns + '/sample/v1/users/0008WJPog',
			    rejectUnauthorized: false,
					headers: {
			  			'Accept-Encoding' : 'gzip',
						  'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
			//unexpected error
				var expectedResult = {};
	    request(options, function (error, response, body){
				if (error) {console.log('error:' + error);}
				//if (response) {console.log('response:' + JSON.stringify(response));}
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body).to.not.be.undefined;
	    	expect(body.id).to.equal('0008WJPog');
	    	done();
	  	});
		});

	it('should return a http code 304 witout content when id exists and right etag is send', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/0008WJPog',
			    headers: {
			    		'If-None-Match': '1',
			  			'Accept-Encoding' : 'gzip',
						  'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(304);
	    	expect(body).to.be.undefined;
	    	done();
	  	});
		});

	it('should return a http code 200 without content wen id exists and etag not valid', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/0008WJPog',
			    headers: {
			    		'If-None-Match': 'wrongetag',
			  			'Accept-Encoding' : 'gzip',
						  'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body).to.not.be.undefined;
	    	expect(body.id).to.equal('0008WJPog');
	    	done();
	  	});
		});


	it('should compress http when asked', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1117WJPog',
			    headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    rejectUnauthorized: false,
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(response);
	    	expect(response).to.not.be.undefined;
	    	expect(body).to.not.be.undefined;
	    	//expect(response.headers).to.have.property('content-encoding').and.to.equal('gzip');
	    	//todo : compress data
	    	done();
	  	});
		});


		it('should not compress when not asked', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1117WJPog',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(response);
	    	expect(response).to.not.be.undefined;
	    	expect(body).to.not.be.undefined;
	    	expect(response.headers).to.not.have.property('content-encoding');
	    	done();
	  	});
	});



		it('should send only fields in the query ?fields=', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1117WJPog?fields=id,creation_date,unknown_fields',
			    headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    rejectUnauthorized: false,
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(response);
	    	expect(response).to.not.be.undefined;
	    	expect(body).to.not.be.undefined;
	    	expect(body.id).to.equal('1117WJPog');
	    	expect(body.creation_date).to.not.be.undefined;;
	    	expect(body.unknown_fields).to.be.undefined;
	    	expect(body.modification_date).to.be.undefined;
	    	done();
	  	});
		});

		it('should send only fields with hierarchical json ?fields=address', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/0008WJPog?fields=id,address',
			    headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    rejectUnauthorized: false,
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(response);
	    	expect(response).to.not.be.undefined;
	    	expect(body).to.not.be.undefined;
	    	expect(body.id).to.equal('0008WJPog');
	    	expect(body.address).to.not.be.undefined;
	    	expect(body.address.postal_code).to.not.be.undefined;
				expect(body.address.locality).to.not.be.undefined;
	    	expect(body.modification_date).to.be.undefined;
	    	done();
	  	});
		});

		it('should send only fields with hierarchical json ?fields=address.postal_code', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/0008WJPog?fields=id,address.postal_code',
			    headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    rejectUnauthorized: false,
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(response);
	    	expect(response).to.not.be.undefined;
	    	expect(body).to.not.be.undefined;
	    	expect(body.id).to.equal('0008WJPog');
	    	expect(body.address).to.not.be.undefined;
	    	expect(body.address.postal_code).to.not.be.undefined;
	    	expect(body.address.locality).to.be.undefined;
				expect(body.modification_date).to.be.undefined;
	    	done();
	  	});
		});


	}); //end GET RETRIEVE




	describe('GET LIST /sample/v1/users', function(){


		it('should return a http code 404 when collection do not exist', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/users/v1/unknown_collection',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	//expect(response).to.have.property("statusCode").and.to.equal(404);
	    	//expect(JSON.stringify(body)).to.equal('{}');
	    	//todo : check if collection exists
	    	done();
	  	});
		});

		it('should return a http code 200 and a content when collection exists', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body.users).to.not.be.undefined;
	    	expect(body.paging).to.not.be.undefined;
	    	done();
	  	});
		});

		it('should return a http code 200 and a pagination', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body.users).to.not.be.undefined;
	    	expect(body.users).to.have.length.of.at.least(1);
	    	expect(body.paging).to.not.be.undefined;
	    	expect(body.paging.total_results).to.not.be.undefined;
	    	expect(body.paging.next).to.not.be.undefined;
	    	done();
	  	});
		});

		it('should return a http code 200 and a pagination ?start_index=2&count=3', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?start_index=2&count=3',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body.users).to.not.be.undefined;
	    	expect(body.users).to.have.length.of(3);
	    	expect(body.paging).to.not.be.undefined;
	    	expect(body.paging.total_results).to.not.be.undefined;
	    	expect(body.paging.next).to.not.be.undefined;
	    	expect(body.paging.prev).to.not.be.undefined;
	    	//todo : tester le contenu de prev et next
	    	done();
	  	});
		});


		it('should return a http code 400 and an error when pagination count is wrong', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?count=10000000000000',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body[0].error);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(400);
	    	expect(body[0].error).to.not.be.undefined
	    	expect(body[0].error).to.equal('max_pagination_count');
	    	expect(body[0].error_description).to.not.be.undefined;
	    	expect(body.users).to.be.undefined;
	    	expect(body.paging).to.be.undefined;
	    	done();
	  	});
		});


		it('should return only fields in parameters ?fields=id,creation_date,unknown_fields', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?fields=id,creation_date,unknown_fields',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body.users).to.not.be.undefined;
	    	expect(body.users).to.have.length.of.at.least(1);
	    	expect(body.users[0].id).to.not.be.undefined;
	    	expect(body.users[0].creation_date).to.not.be.undefined;
	    	expect(body.users[0].unknown_fields).to.be.undefined;
	    	expect(body.users[0].modification_date).to.be.undefined;
	    	expect(body.paging).to.not.be.undefined;
	    	expect(body.paging.total_results).to.not.be.undefined;
	    	expect(body.paging.next).to.not.be.undefined;
	    	done();
	  	});
		});

	it('should retourner return asked fields with pagination', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?fields=id,creation_date,unknown_fields&start_index=2&count=3',
					headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},			    rejectUnauthorized: false,
			    rejectUnauthorized: false,
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body.users).to.not.be.undefined;
	    	expect(body.users).to.have.length.of(3);
	    	expect(body.users[0].id).to.not.be.undefined;
	    	expect(body.users[0].creation_date).to.not.be.undefined;
	    	expect(body.users[0].unknown_fields).to.be.undefined;
	    	expect(body.users[0].modification_date).to.be.undefined;
	    	expect(body.users[2].id).to.not.be.undefined;
	    	expect(body.users[2].creation_date).to.not.be.undefined;
	    	expect(body.users[2].unknown_fields).to.be.undefined;
	    	expect(body.users[2].modification_date).to.be.undefined;
	    	expect(body.paging).to.not.be.undefined;
	    	expect(body.paging.total_results).to.not.be.undefined;
	    	expect(body.paging.next).to.not.be.undefined;
	    	done();
	  	});
		});

		it('should return a http code 304 without content when etag is right', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?fields=id,creation_date,unknown_fields&start_index=2&count=1',
			    rejectUnauthorized: false,
			    headers: {
			    		'If-None-Match': 'b1f23',
			  			'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'
						},
					    json: true
			};
	    request(options, function (error, response, body){
	    	var options = {
						timeout: 2000,
				    url: dns + '/sample/v1/users?fields=id,creation_date,unknown_fields&start_index=2&count=1',
				    rejectUnauthorized: false,
				    headers: {
				    		'If-None-Match': response.headers.etag ,
								'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'
							},

				    json: true
				};
				request(options, function (error, response, body){
					expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(304);
		    	expect(body).to.be.undefined;

		  	});
				done();
				});
		});


		// à vérifier ce test
		it('should return a http code 200 with content when etag is wrong', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?fields=id,creation_date,unknown_fields&start_index=2&count=3',
			    rejectUnauthorized: false,
			    headers: {
			    		'If-None-Match': 'wrong_etag_value',
								'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body).to.be.not.undefined;
	    	done();
	  	});
		});

		// à vérifier ce test
		it('should compress http if asked', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?fields=id,creation_date,unknown_fields&start_index=2&count=3',
			    rejectUnauthorized: false,
			    headers: {'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
			var expectedResult = {};
	    request(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	//expect(response.headers).to.have.property('content-encoding');
	    	//expect(response.headers['content-encoding']).to.equal('gzip');
	      //todo : compress data
	    	done();
	  	});
		});

		it('should retrieve data when attributes exists _exists=true', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?address_exists=true',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);
		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.users).to.have.length.of.at.least(1);

					done();
		  	});
		});


		it('should retrieve data when attributes exists _exists=true with hierarchical', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?address.postal_code_exists=true',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);

		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.users).to.have.length.of.at.least(1);

					done();
		  	});
		});

		it('should not return data with _exists if attributes not exists', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?attribute_that_not_exists_exists=true',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);
		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.paging.total_results).to.equal(0);

					done();
		  	});
		});



		it('should return data with _exists=false', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?address_exists=false',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);

		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.users).to.have.length.of.at.least(1);

					done();
		  	});
		});

		it('should retrieve data when attributes not exists _exists=false with hierarchical', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?address.postal_code_exists=false',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);

		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.users).to.have.length.of.at.least(1);

					done();
		  	});
		});


		it('should return no ressources if attributes exist on all ressources _exists=false', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?id_exists=false',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);

		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.paging.total_results).to.equal(0);

					done();
		  	});
		});

		it('should manage _gte (greater than equal) when there is result', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?votes_gte=0',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);

		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.paging.total_results).at.least(1);

					done();
		  	});
		});

		it('should manage _gte (greater than equal) when there is no result', function (done) {
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users?votes_gte=9999999',
					rejectUnauthorized: false,
					headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
					json: true
			};
			request(options, function (error, response, body){
				//console.log(body);

					expect(response).to.not.be.undefined;
					expect(response).to.have.property("statusCode").and.to.equal(200);
					expect(body).to.be.not.undefined;
					expect(body.paging.total_results).to.be.equal(0);

					done();
				});
		});

		it('should manage _gt (greater than) when there is result', function (done) {
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users?votes_gt=0',
			    rejectUnauthorized: false,
			    headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			    json: true
			};
	    request(options, function (error, response, body){
	    	//console.log(body);

		    	expect(response).to.not.be.undefined;
		    	expect(response).to.have.property("statusCode").and.to.equal(200);
		    	expect(body).to.be.not.undefined;
					expect(body.paging.total_results).at.least(1);

					done();
		  	});
		});

		it('should manage _gt (greater than) when there is no result', function (done) {
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users?votes_gt=9999999',
					rejectUnauthorized: false,
					headers: {
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
					json: true
			};
			request(options, function (error, response, body){
				//console.log(body);

					expect(response).to.not.be.undefined;
					expect(response).to.have.property("statusCode").and.to.equal(200);
					expect(body).to.be.not.undefined;
					expect(body.paging.total_results).to.be.equal(0);

					done();
				});
		});


it('should manage _lte (lower than equal) when there is result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_lte=99999999',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
		//console.log(body);

			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).at.least(1);

			done();
		});
});

it('should manage _lte (lower than equal) when there is no result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_lte=0',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
		//console.log(body);

			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});

it('should manage _lt (lower than) when there is result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_lt=999999999',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
		//console.log(body);

			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).at.least(1);

			done();
		});
});

it('should manage _lt (lower than) when there is no result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_lt=0',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
		//console.log(body);

			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});

it('should manage _lte (lower than equal) AND _gte (lower than equal) when there is result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_lte=18&votes_gte=18',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
		//console.log(body);

			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(2);

			done();
		});
});

it('should manage _lt (lower than) AND _gt (lower than) when there is result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_lt=19&votes_gt=17',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
		//console.log(body);

			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(2);

			done();
		});
});


it('should manage dates AND _lt (lower than) AND _gt (lower than) when there is result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?creation_date_lt=now%2B1d/d&creation_date_gt=now-1y/d',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(2);

			done();
		});
});

it('should manage _ne (not equal) when there is match', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?id_ne=0008WJPog',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
	    expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _ne (not equal) when there is no match', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?id_ne=wrong',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _prefix when there is results', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_prefix=test',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _prefix when there is no results', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_prefix=zert',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});

it('should manage _like when there is results name_like=*est*', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_like=*est*',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _like when there is results name_like=test*', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_like=test*',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _like when there is no results', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_like=zert*',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});


it('should manage _regex when there is results name_like=test*', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_regex=clo.?dio',
			rejectUnauthorized: false,
			headers: {
				'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _regex when there is no results', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_regex=tlo.?dio',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});

it('should manage _fuzzy when it is on a number and there is result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_fuzzy=2',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _fuzzy when it is on a number and there is no result', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?votes_fuzzy=1234567',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});

it('should manage _fuzzy on string when there is results cladio --> clodio', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_fuzzy=cladio',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});

it('should manage _fuzzy on string when there is results cldio --> clodio', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_fuzzy=cldio',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});


it('should manage _fuzzy on string when there is no results', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users?name_fuzzy=aaaa',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});


it('should manage search?q= when there is results ', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/search?q=*lodi',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.at.least(1);

			done();
		});
});


it('should manage search?q= when there is no results', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/search?q=*notexist',
			rejectUnauthorized: false,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'},
			json: true
	};
	request(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.paging.total_results).to.be.equal(0);

			done();
		});
});



	}); // end GET LIST



	describe('POST CREATE  /sample/v1/users', function(){

		it('should create data', function (done) {

			var randomName = randomValue();
			var body = { name: randomName};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
							'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(201);
				expect(body).to.be.not.undefined;
				expect(body.name).to.be.not.undefined
				expect(body.id).to.be.not.undefined
				expect(body.creation_date).to.be.not.undefined
				expect(body.modification_date).to.be.not.undefined
				expect(body.etag).to.be.not.undefined
				expect(body.etag).to.equal("1")
				expect(body.name).to.equal(randomName);
				done();
			});
		});


		it('should create data with custom creation_date and modification_date', function (done) {

			var randomName = randomValue();
			var randomDateCreation= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
			var randomDateModification= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
			var body = {name: randomName, creation_date: randomDateCreation, modification_date:randomDateModification, status:"to_delete"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
							'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(201);
				expect(body).to.be.not.undefined;
				expect(body.name).to.be.not.undefined
				expect(body.name).to.equal(randomName);
				expect(body.creation_date).to.be.not.undefined
				expect(body.creation_date).to.equal(randomDateCreation);
				expect(body.modification_date).to.be.not.undefined
				expect(body.modification_date).to.equal(randomDateModification);
				done();
			});
		});

		it('should NOT create data with wrong creation_date ', function (done) {

			var body = {name: "testName", creation_date:"WRONG_DATE", status:"to_delete"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
							'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				expect(body.id).to.be.undefined
				expect(body[0].error).to.equal('wrong_arguments');
				expect(body[0].error_description).to.equal('failed to parse [creation_date]');
				done();
			});
		});

		it('should NOT create data with wrong modification_date ', function (done) {

			var body = {name: "testName", modification_date:"WRONG_DATE", status:"to_delete"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
							'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				expect(body.id).to.be.undefined
				expect(body[0].error).to.equal('wrong_arguments');
				expect(body[0].error_description).to.equal('failed to parse [modification_date]');
				done();
			});
		});

		it('should not create data when id in url already exist', function (done) {

			var randomName = randomValue();
			var body = { name: randomName};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
							'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(201);
				expect(body).to.be.not.undefined;
				expect(body.name).to.be.not.undefined
				expect(body.id).to.be.not.undefined
				expect(body.creation_date).to.be.not.undefined
				expect(body.modification_date).to.be.not.undefined
				expect(body.etag).to.be.not.undefined
				expect(body.etag).to.equal("1")
				expect(body.name).to.equal(randomName);
				done();
			});
		});

		it('should not create data when id is only in body', function (done) {

			var randomName = randomValue();
			var body = { id:"2227PogWJ",  name: randomName};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				expect(body[0]).to.be.not.undefined
				expect(body[0].error).to.equal("error_id");
				expect(body[0].error_description).to.equal("id must not be present while creating ressource");

				done();
			});
		});

	});//end POST CREATE




		describe('POST partial update  /sample/v1/users/:id', function(){

		it('should return a http code 400 when id is different in url and body', function (done) {
	  	var body = {id:'different_id', mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/unknown_ressource_id',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(400);
	    	expect(body).to.not.be.undefined;
	    	expect(body[0].error).to.equal('wrong_id');
	    	done();
	  	});
		});

		it('should return a http code 404 when the id is not in params or in body', function (done) {
	  	var body = {id:'unknown_ressource_id', mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/unknown_ressource_id',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(404);
	    	expect(body).to.be.undefined;
	    	done();
	  	});
		});

    it('should return a http code 404 when the ressource not exists', function (done) {
	  	var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/unknown_ressource_id',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	//console.log(body);
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(404);
	    	expect(body).to.be.undefined;
	    	done();
	  	});
		});


		it('should return a http code 200 when the ressource exists', function (done) {
	  	var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body).to.be.not.undefined;
	    	expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
	    	done();
	  	});
		});

		it('should alter with hierarchical data', function (done) {
			var myRandomValue = randomValue();
			var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword", hierarchical:{data:myRandomValue}};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body).to.be.not.undefined;
	    	expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
				expect(body.hierarchical.data).to.equal(myRandomValue);
	    	done();
	  	});
		});

		it('should send an error when id is different in body and in URI (wrong body)', function (done) {
	  	var body = {id: "wrong", mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(400);
	    	expect(body).to.be.not.undefined;
	    	expect(body.mail).to.be.undefined;
				expect(body[0].error).to.equal("wrong_id");
				expect(body[0].error_description).to.be.not.undefined;
				expect(JSON.stringify(body)).to.contain('do not match id in body');
	    	done();
	  	});
		});


		it('should send an error when id is different in body and in URI (wrong id)', function (done) {
	  	var body = {id: "1", mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/wrong',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(400);
	    	expect(body).to.be.not.undefined;
			  expect(body.mail).to.be.undefined;
				expect(body[0].error).to.equal("wrong_id");
				expect(body[0].error_description).to.be.not.undefined;
				expect(JSON.stringify(body)).to.contain('do not match id in body');
	    	done();
	  	});
		});

		it('should partially update data', function (done) {

			var randomName = randomValue();
			var randomDateCreation= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
			var randomDateModification= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
			var body = {id: "1", name: randomName, creation_date: randomDateCreation, modification_date:randomDateModification};
	  	var options = {
					timeout: 2000,
			    url: dns + '/sample/v1/users/1',
			    rejectUnauthorized: false,
			    body: body,
			    json: true,
			    headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
	    	expect(response).to.not.be.undefined;
	    	expect(response).to.have.property("statusCode").and.to.equal(200);
	    	expect(body).to.be.not.undefined;
			  expect(body.name).to.be.not.undefined
				expect(body.name).to.equal(randomName);
				expect(body.creation_date).to.equal(randomDateCreation);
				expect(body.modification_date).to.equal(randomDateModification);
				expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
	    	done();
	  	});
		});



		it('should not update data when creation_date is wrong', function (done) {

			var randomName = randomValue();
			var body = { id:"1",  creation_date:"wong_format"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users/1',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				expect(body[0]).to.be.not.undefined
				expect(body[0].error).to.equal("wrong_arguments");
				expect(body[0].error_description).to.equal("failed to parse [creation_date]");

				done();
			});
	  });

		it('should not update data when modification_date is wrong', function (done) {

			var randomName = randomValue();
			var body = { id:"1",  modification_date:"wong_format"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users/1',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				expect(body[0]).to.be.not.undefined
				expect(body[0].error).to.equal("wrong_arguments");
				expect(body[0].error_description).to.equal("failed to parse [modification_date]");

				done();
			});
	  });

		it('should not update data when etag is wrong', function (done) {

			var randomName = randomValue();
			var body = { id:"1"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users/1',
					rejectUnauthorized: false,
					body: body,
					json: true,
					headers: {
    'If-None-Match' : '1234567',
		'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(412);
				expect(body).to.be.not.undefined;
				expect(body[0]).to.be.not.undefined
				expect(body[0].error).to.equal("ressource_version_conflict");
				expect(body[0].error_description).to.contain("Conflict on ressource");

				done();
			});
	  });

		it('should send an error when body is empty', function (done) {

			var randomName = randomValue();
			var body = { id:"1"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users/1',
					rejectUnauthorized: false,
					json: true,
					headers: {
		'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				expect(body[0]).to.be.not.undefined
				expect(body[0].error).to.equal("wrong_body");
				expect(body[0].error_description).to.contain("The http body request is invalid or empty");

				done();
			});
	  });

		it('should send an error when body is not json valid', function (done) {

			var randomName = randomValue();
			var body = { id:"1"};
			var options = {
					timeout: 2000,
					url: dns + '/sample/v1/users/1',
					rejectUnauthorized: false,
					body: ' modification_date:"wong_format"}',
					headers: {
		'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
			};
			request.post(options, function (error, response, body){
				expect(response).to.not.be.undefined;
				expect(response).to.have.property("statusCode").and.to.equal(400);
				expect(body).to.be.not.undefined;
				var bodyJson = eval("(" + body + ")");
				expect(bodyJson[0]).to.be.not.undefined
				expect(bodyJson[0].error).to.equal("wrong_body");
				expect(bodyJson[0].error_description).to.contain("The http body request is invalid or empty");

				done();
			});
	  });
		//todo : update with right etag

	}); // end POST partial update





	describe('PATCH partial update  /sample/v1/users/:id', function(){

	it('should return a http code 400 when id is different in url and body', function (done) {
		var body = {id:'different_id', mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/unknown_ressource_id',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			//console.log(body);
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.not.be.undefined;
			expect(body[0].error).to.equal('wrong_id');
			done();
		});
	});

	it('should return a http code 404 when the ressource not exists in url and body', function (done) {
		var body = {id:'unknown_ressource_id', mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/unknown_ressource_id',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			//console.log(body);
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(404);
			expect(body).to.be.undefined;
			done();
		});
	});

	it('should return a http code 404 when the ressource not exists', function (done) {
		var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/unknown_ressource_id',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			//console.log(body);
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(404);
			expect(body).to.be.undefined;
			done();
		});
	});


	it('should return a http code 200 when the ressource exists', function (done) {
		var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
			done();
		});
	});

	it('should alter with hierarchical data', function (done) {
		var myRandomValue = randomValue();
		var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword", hierarchical:{data:myRandomValue}};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
			expect(body.hierarchical.data).to.equal(myRandomValue);
			done();
		});
	});

	it('should send an error when id is different in body and in URI (wrong body)', function (done) {
		var body = {id: "wrong", mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			expect(body.mail).to.be.undefined;
			expect(body[0].error).to.equal("wrong_id");
			expect(body[0].error_description).to.be.not.undefined;
			expect(JSON.stringify(body)).to.contain('do not match id in body');
			done();
		});
	});


	it('should send an error when id is different in body and in URI (wrong id)', function (done) {
		var body = {id: "1", mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/wrong',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			expect(body.mail).to.be.undefined;
			expect(body[0].error).to.equal("wrong_id");
			expect(body[0].error_description).to.be.not.undefined;
			expect(JSON.stringify(body)).to.contain('do not match id in body');
			done();
		});
	});

	it('should partially update data', function (done) {

		var randomName = randomValue();
		var randomDateCreation= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
		var randomDateModification= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
		var body = {id: "1", name: randomName, creation_date: randomDateCreation, modification_date:randomDateModification};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(200);
			expect(body).to.be.not.undefined;
			expect(body.name).to.be.not.undefined
			expect(body.name).to.equal(randomName);
			expect(body.creation_date).to.equal(randomDateCreation);
			expect(body.modification_date).to.equal(randomDateModification);
			expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
			done();
		});
	});



	it('should not update data when creation_date is wrong', function (done) {

	var randomName = randomValue();
		var body = { id:"1",  creation_date:"wong_format"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			expect(body[0]).to.be.not.undefined
			expect(body[0].error).to.equal("wrong_arguments");
			expect(body[0].error_description).to.equal("failed to parse [creation_date]");

			done();
		});
	});

	it('should not update data when modification_date is wrong', function (done) {

		var randomName = randomValue();
		var body = { id:"1",  modification_date:"wong_format"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			expect(body[0]).to.be.not.undefined
			expect(body[0].error).to.equal("wrong_arguments");
			expect(body[0].error_description).to.equal("failed to parse [modification_date]");

			done();
		});
	});

	it('should not update data when etag is wrong', function (done) {

		var randomName = randomValue();
		var body = { id:"1"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
	'If-None-Match' : '1234567',
	'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(412);
			expect(body).to.be.not.undefined;
			expect(body[0]).to.be.not.undefined
			expect(body[0].error).to.equal("ressource_version_conflict");
			expect(body[0].error_description).to.contain("Conflict on ressource");

			done();
		});
	});

	it('should send an error when body is empty', function (done) {

		var randomName = randomValue();
		var body = { id:"1"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				json: true,
				headers: {
	'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			expect(body[0]).to.be.not.undefined
			expect(body[0].error).to.equal("wrong_body");
			expect(body[0].error_description).to.contain("The http body request is invalid or empty");

			done();
		});
	});

	it('should send an error when body is not json valid', function (done) {

		var randomName = randomValue();
		var body = { id:"1"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/1',
				rejectUnauthorized: false,
				body: ' modification_date:"wong_format"}',
				headers: {
	'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.patch(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			var bodyJson = eval("(" + body + ")");
			expect(bodyJson[0]).to.be.not.undefined
			expect(bodyJson[0].error).to.equal("wrong_body");
			expect(bodyJson[0].error_description).to.contain("The http body request is invalid or empty");

			done();
		});
	});
	//todo : update with right etag

}); // end PATCH partial update

describe('PUT create  /sample/v1/users/:id', function(){

	it('should create a ressource when not existing', function (done) {
		var myId = randomValue();
		var myName = randomValue();
		var body = {id:myId, name: myName,status:"to_delete"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/' + myId,
				rejectUnauthorized: false,
				body: body,
				json: true,
				headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.put(options, function (error, response, body){
			//console.log(body);
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(201);
			expect(body).to.be.not.undefined;
			expect(body.name).to.equal(myName);
			expect(body).to.be.not.undefined;
			expect(body.id).to.equal(myId);
			expect(body.creation_date).to.be.not.undefined;
			expect(body.modification_date).to.be.not.undefined;
			expect(body.etag).to.be.not.undefined;
			done();
		});
	});

	it('should send an error when body is empty', function (done) {

		var randomName = randomValue();
		var body = { id:"1"};
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/' + randomName,
				rejectUnauthorized: false,
				json: true,
				headers: {
	'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.put(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			expect(body[0]).to.be.not.undefined
			expect(body[0].error).to.equal("wrong_body");
			expect(body[0].error_description).to.contain("The http body request is invalid or empty");

			done();
		});
	});

	it('should send an error when body is not json valid', function (done) {

		var randomName = randomValue();
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/' + randomName,
				rejectUnauthorized: false,
				body: ' modification_date:"wong_format"}',
				headers: {
	'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.put(options, function (error, response, body){
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(400);
			expect(body).to.be.not.undefined;
			var bodyJson = eval("(" + body + ")");
			expect(bodyJson[0]).to.be.not.undefined
			expect(bodyJson[0].error).to.equal("wrong_body");
			expect(bodyJson[0].error_description).to.contain("The http body request is invalid or empty");

			done();
		});
	});

});

describe('PUT full update  /sample/v1/users/:id', function(){

it('should return a http code 400 when id is different in url and body', function (done) {
	var body = {id:'different_id', mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/unknown_ressource_id',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		//console.log(body);
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.not.be.undefined;
		expect(body[0].error).to.equal('wrong_id');
		done();
	});
});




it('should return a http code 200 when the ressource exists', function (done) {
	var myName = randomValue();
	var body = {name:myName, mail: "unittestusertodelete1@gmail.com", pwd: "mypassword", need_to_disapear_in_few_test:"true"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(200);
		expect(body).to.be.not.undefined;
		expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
		expect(body.name).to.be.not.undefined;
		expect(body.name).to.equal(myName);
		expect(body.need_to_disapear_in_few_test).to.be.not.undefined;
		done();
	});
});


it('should alter with hierarchical data', function (done) {
	var randomData = randomValue();
	var body = {mail: "unittestusertodelete1@gmail.com", pwd: "mypassword", hierarchical:{data:randomData}};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(200);
		expect(body).to.be.not.undefined;
		expect(body.mail).to.equal("unittestusertodelete1@gmail.com");
		expect(body.hierarchical.data).to.equal(randomData);
		done();
	});
});

it('should send an error when id is different in body and in URI (wrong body)', function (done) {
	var body = {id: "wrong", mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.be.not.undefined;
		expect(body.mail).to.be.undefined;
		expect(body[0].error).to.equal("wrong_id");
		expect(body[0].error_description).to.be.not.undefined;
		expect(JSON.stringify(body)).to.contain('do not match id in body');
		done();
	});
});


it('should send an error when id is different in body and in URI (wrong id)', function (done) {
	var body = {id: "1", mail: "unittestusertodelete1@gmail.com", pwd: "mypassword"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/wrong',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.be.not.undefined;
		expect(body.mail).to.be.undefined;
		expect(body[0].error).to.equal("wrong_id");
		expect(body[0].error_description).to.be.not.undefined;
		expect(JSON.stringify(body)).to.contain('do not match id in body');
		done();
	});
});

it('should full update data', function (done) {

	var randomName = randomValue();
	var randomDateCreation= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
	var randomDateModification= "2016-0" + (Math.floor(Math.random() * 8)+1) + "-" + (Math.floor(Math.random() * 18)+10) + "T" + (Math.floor(Math.random() * 10)+10) + ":" + (Math.floor(Math.random() * 49)+10) + ":" + (Math.floor(Math.random() * 49)+10) + "Z"
	var body = {id: "1", name: randomName, creation_date: randomDateCreation, modification_date:randomDateModification};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(200);
		expect(body).to.be.not.undefined;
		expect(body.name).to.be.not.undefined
		expect(body.name).to.equal(randomName);
		expect(body.creation_date).to.equal(randomDateCreation);
		expect(body.modification_date).to.equal(randomDateModification);
		expect(body.mail).to.be.undefined;
		expect(body.need_to_disapear_in_few_test).to.be.undefined; //this field has been aded before
		done();
	});
});



it('should not update data when creation_date is wrong', function (done) {

	var randomName = randomValue();
	var body = { id:"1",  creation_date:"wong_format"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.be.not.undefined;
		expect(body[0]).to.be.not.undefined
		expect(body[0].error).to.equal("wrong_arguments");
		expect(body[0].error_description).to.equal("failed to parse [creation_date]");

		done();
	});
});

it('should not update data when modification_date is wrong', function (done) {

	var randomName = randomValue();
	var body = { id:"1",  modification_date:"wong_format"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.be.not.undefined;
		expect(body[0]).to.be.not.undefined
		expect(body[0].error).to.equal("wrong_arguments");
		expect(body[0].error_description).to.equal("failed to parse [modification_date]");

		done();
	});
});

it('should not update data when etag is wrong', function (done) {

	var randomName = randomValue();
	var body = { id:"1"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/1',
			rejectUnauthorized: false,
			body: body,
			json: true,
			headers: {
'If-None-Match' : '1234567',
'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(412);
		expect(body).to.be.not.undefined;
		expect(body[0]).to.be.not.undefined
		expect(body[0].error).to.equal("ressource_version_conflict");
		expect(body[0].error_description).to.contain("Conflict on ressource");

		done();
	});
});

it('should send an error when body is empty', function (done) {

	var randomName = randomValue();
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/' + randomName,
			rejectUnauthorized: false,
			json: true,
			headers: {
'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.be.not.undefined;
		expect(body[0]).to.be.not.undefined
		expect(body[0].error).to.equal("wrong_body");
		expect(body[0].error_description).to.contain("The http body request is invalid or empty");

		done();
	});
});

it('should send an error when body is not json valid', function (done) {

	var randomName = randomValue();
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/' + randomName,
			rejectUnauthorized: false,
			body: ' modification_date:"wong_format"}',
			headers: {
'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(400);
		expect(body).to.be.not.undefined;
		var bodyJson = eval("(" + body + ")");
		expect(bodyJson[0]).to.be.not.undefined
		expect(bodyJson[0].error).to.equal("wrong_body");
		expect(bodyJson[0].error_description).to.contain("The http body request is invalid or empty");

		done();
	});
});
//todo : update with right etag

}); // end PUT full update











describe('DELETE  /sample/v1/users/:id', function(){





it('should send a http code 204 when ressource exist', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/to_delete1',
			rejectUnauthorized: false,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.del(options, function (error, response, body){
		//console.log(body);
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(204);
		expect(body).to.be.undefined;
		done();
	});
});

it('should send a http code 404 when ressource do not exist', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/to_delete1',
			rejectUnauthorized: false,
			json: true,
			headers: {
    'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.del(options, function (error, response, body){
		//console.log(body);
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(404);
		expect(body).to.be.undefined;
		done();
	});
});


it('should not delete and send a http code 412 when etag provided do not match', function (done) {
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/to_delete2',
			rejectUnauthorized: false,
			json: true,
			headers: {
				'If-None-Match': '999999999',
						'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.del(options, function (error, response, body){
		//console.log(body);
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(412);
		expect(body).to.be.not.undefined;
		expect(body[0].error).to.equal("ressource_version_conflict");
		done();
	});
});


var randomName = randomValue();

it('should delete send a http code 204 when etag provided is matching', function (done) {
	var randomName = randomValue();
	var body = { is_vip:"true"};
	var options = {
			timeout: 2000,
			url: dns + '/sample/v1/users/' + randomName,
			rejectUnauthorized: false,
			body:body,
			json: true,
			headers: {
					'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
	};
	request.put(options, function (error, response, body){
		//console.log(body);
		expect(response).to.not.be.undefined;
		expect(response).to.have.property("statusCode").and.to.equal(201);
		var options = {
				timeout: 2000,
				url: dns + '/sample/v1/users/' + body.id,
				rejectUnauthorized: false,
				json: true,
				headers: {
					'If-None-Match': '1',
							'Accept-Encoding' : 'gzip','Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'}
		};
		request.del(options, function (error, response, body){
			//console.log(body);
			expect(response).to.not.be.undefined;
			expect(response).to.have.property("statusCode").and.to.equal(204);
			expect(body).to.be.undefined;
			done();
		});
		done();
	});


});

}); // end delete

//todo swagger
//todo postman
//todo subressources


});// end describe glogal
