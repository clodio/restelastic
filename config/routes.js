/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

	'/*' : 'SessionController.disable',

  '/': {
    view: 'homepage',
    locals: {
			api: {
      	domain: 'data' ,
      	version: 'v1',
      	ressource: 'products'
    	}
		}
  },

	/***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  //'GET /users/v1/user/:id': 'RessourceController.alter',

	/* add assets routes to avoid authentification */
	'GET /js/:file': 'AssetsController.assets',
	'GET /images/:file': 'AssetsController.assets',
	'GET /styles/:file': 'AssetsController.assets',
	'GET /templates/:file': 'AssetsController.assets',
	'GET /favicon.ico': 'AssetsController.assets',
	'GET /robots.txt': 'AssetsController.assets',
	'GET /sitemap.xml': 'AssetsController.assets',

	'GET /:domain/:version/swagger/:id': 'RessourceController.swagger_template',

	'GET /:domain/:version/:model/:id/_:secondModel/search?*': 'RessourceController.searchSecondModel',
	'GET /:domain/:version/:model/:id/_:secondModel/:secondId': 'RessourceController.findOneSecondModel',
  'GET /:domain/:version/:model/:id/_:secondModel': 'RessourceController.findAllSecondModel',
	'PUT /:domain/:version/:model/:id/_:secondModel/:secondId': 'RessourceController.alterOrCreateSecondModel',
	'POST /:domain/:version/:model/:id/_:secondModel': 'RessourceController.createSecondModel',
  'POST /:domain/:version/:model/:id/_:secondModel/:secondId': 'RessourceController.alterSecondModel',
	'PATCH /:domain/:version/:model/:id/_:secondModel/:secondId': 'RessourceController.alterSecondModel',
	'DELETE /:domain/:version/:model/:id/_:secondModel/:secondId': 'RessourceController.deleteSecondModel',

	'GET /:domain/:version/:model/search?*': 'RessourceController.search',
	'GET /:domain/:version/:model/swagger.yaml?*': 'RessourceController.swagger',
	'GET /:domain/:version/:model/postman.json?*': 'RessourceController.postman',
	'GET /:domain/:version/:model/:id': 'RessourceController.findOne',
  'GET /:domain/:version/:model?*': 'RessourceController.findAll',
  'PUT /:domain/:version/:model/:id': 'RessourceController.alterOrCreate',
  'POST /:domain/:version/:model': 'RessourceController.create',
  'POST /:domain/:version/:model/:id': 'RessourceController.alter',
	'PATCH /:domain/:version/:model/:id': 'RessourceController.alter',
  'DELETE /:domain/:version/:model/:id': 'RessourceController.deleteOne',

};
