var jwt = require('jwt-simple');
var jwt2 = require('jsonwebtoken');
var secret = 'MIICcwIBADANBgkqhkiG9w0BAQEFAASCAl0wggJZAgEAAoGBAM6LywlGYW0q06Hk\n+W5eVkWmF96tnSbuExI4CsFQKOVr0Sl0PSewKA+jIHaN3mH40j8gm7FTIA9SNQBf\nlkxEoGluYb6I2R9SFdTNWBDF77mU+pzKJjv57402BS6DPVNIz+Rp9zNkkbM39xgu\n+srVQ1NELEfMd3alLFThAC7muqmtAgMBAAECf3XLRAAGI4oe4pNyAs7u/kS6dOKK\nIRYSsM2zKG8XSDuPQbpikH4R+MbyQZFbV3iIb1+ROTnoLmCOgau02AKnINP51fv0\nEO987hivmI7vl5LPT2+q347IJKgHVoelYV2J/BVi6V/+J+Jvd+vlYOoz97SKVdpk\nzGEoMTXH/OezuzkCQQDnTHLShjthWAZ3NDU/fOVwnkLXiGM0qm+SkmCxOdiHmo4B\nixqNMpCe0UHZi2MXwKp7qZOaM8uem0IzfX7gzCNbAkEA5JqgPwCsnNARo9SGbaMI\nCkNfPzmBtEKYE61w6rgP7+/cxVy8E8+Rx98TEIaICR0fIBxQueOglVhR2P+7Flmd\nlwJAVxeVIKpEj6nafWYeKrK3ngkpeAi1+i2250TQvcrfOmg60l/zdnk0tWhr2CNB\nA7+bMgcvOeAI6sbhTYwSi0iygwJAKk7Xs3FLgOYdLaXqjyXqGgQn/4qED7l3bcTe\nrgIMqQpKYJhuEniK8WO+ooNTb+Rc21OCOTUAhkNHOpLxrAw/1wJAYhdhQ0TTVNx6\nnv0ktTZBpvnUGFOuUeJKk8ewhFYPdjVt9BYL2rW9M2NEVEcBh15NJ1qRmbmC8PJC\naYIIo6LkAQ\u003d\u003d';
module.exports = function isRessourcesReadWrite (req, res, next) {

//TODO : change jwt-simple with jsonwebtoken that can do asymetric token
	//console.log("isRessourcesReadWrite");

	var oldtokenReadWrite = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU";
	var oldtokenRead = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCJdfQ.ssrAHB1phB3hGh4n2t7rBJQAJP5GQWM5Qtvg7tR7UwA";
  var oldtokenWrite = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMud3JpdGUiXX0.ltmMFRJuiBaw79InBvDsu2uJ1wqr2nJ4rOdTJTIcXrU";

	// secret The private key to use to sign the token
	// iss MANDATOTY The issuer, usually the client_id
	// prn MANDATOTY The principal MAY identify the resource owner for whom the access token is being requested.  For  client authentication, the principal MUST be the "client_id" ofthe OAuth client.
	// aud MANDATOTY The audience, usually the URI for the oauth server
	// exp MANDATOTY The expiration date. If the current time is greater than the exp, the JWT is invalid
	// nbf The "not before" time. If the current time is less than the nbf, the JWT is invalid
	// jti The "jwt token identifier", or nonce for this JWT

	var tokenExemple={
		iss:"https://claude-idp.laposte.fr",
		prn:"claude.seguret@laposte.fr",
		aud:"https://claude-auth.laposte.fr",
		exp:"1461561721",
		scopes:["ressources.read"]
	}
	//console.log("token.read:" + jwt.encode(tokenExemple, secret))

	var tokenExemple={
		iss:"https://claude-idp.laposte.fr",
		prn:"claude.seguret@laposte.fr",
		aud:"https://claude-auth.laposte.fr",
		exp:"1461561721",
		scopes:["ressources.read", "ressources.write"]
	}
	//console.log("token.readwrite:" + jwt.encode(tokenExemple, secret))

	var tokenExemple={
		iss:"https://claude-idp.laposte.fr",
		prn:"claude.seguret@laposte.fr",
		aud:"https://claude-auth.laposte.fr",
		exp:"1461561721",
		scopes:["ressources.write"]
	}
	//console.log("token.write:" + jwt.encode(tokenExemple, secret))


	//console.log(req.headers.authorization);
	//console.log(jwt.encode(tokenExemple, secret));
 	//req.headers.authorization = jwt.encode(tokenExemple, secret)
   if ( !req.headers.authorization && req.params.model !="swagger") {
   	//console.log("forbidden");
    return res.send(401,{
      "error":"invalid_grant",
      "error_description":"You must provide an authorization"
     });
  }

  try {
	    var decodedJWT = jwt.decode(req.headers.authorization, secret);

			//console.log(decodedJWT.scopes);

			if (!decodedJWT.iss || !decodedJWT.prn || !decodedJWT.aud || !decodedJWT.exp || !decodedJWT.scopes ) {
				return res.send(403, {"error":"authentification_jwt_error","error_description":"mandatory jwt element are not present"});
			}
			var now = Math.floor(_.now()/1000);
			if (decodedJWT.exp > now + 5*365*24*3600) {
				//check if jwt is valid 5 years after current date
				return res.send(403, {"error":"authentification_jwt_expiration_too_far","error_description":"jwt token has a too far expiration date"});
			}
			if (decodedJWT.exp < now) {
				return res.send(403, {"error":"authentification_jwt_expired","error_description":"jwt token is expired"});
			}
			if (decodedJWT.nbf && decodedJWT.nbf > now) {
				return res.send(403, {"error":"authentification_jwt_used_too_early","error_description":"jwt token is used too early"});
			}


			// if you want more security
	    //if ( !( decodedJWT.scopes.indexOf(req.params.domain + '_' + req.params.model + '.write') > -1) ) {
	    if ( !( decodedJWT.scopes.indexOf('ressources' + '.write') > -1) ) {
	    	return res.send(403,  {"error":"authentification_jwt_scope_error","error_description":"jwt token has not enough scopes"});
	    }


	}
	catch(err) {
			//token is invalid
			sails.log(err);
	    return res.send(403,{"error":"authentification_not_allowed","error_description":"you are not allowed to make this api call"});
	}





  // Finally, if the user has a clean record, we'll call the `next()` function
  // to let them through to the next policy or our controller
  next();
};
