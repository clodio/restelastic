# Restlastic

Your restful APIs with __zero coding__ in __less than 30 seconds__...

I spend so many time googling for a easy way to have a free full feature REST API without finding what i want, so i decided to create restlastic to get the ideas from json-server, the modularity of sails.js, the scalability and features of elasticsearch and kibana.

See the [5min video presentation](https://www.youtube.com/watch?time_continue=6&v=Jsh3Ai7USOw)

```
GET /restlastic?price=free
{
    features : {
    create : "Your Restful APIs in less than 30 sec",
    code : "0 line of code",
    enjoy : "Pagination, search, filters, fulltext,...",
    generate : "Instantly swagger, postman, mocha",
    dashboard : "Realtime graph with kibana",
    scalable : "To infinity and beyond",
    customise : "based on sails.js, elasticsearch"
  },
  tagline: "You Know, for API"
}
```

## Example

Create a `products` API (/data/v1/products)

```
curl -iX POST \
    -H 'Content-Type: application/json; charset=utf-8' \
    -H 'Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU' \
    -d '{ "name":"banana", "status":"available", "price":12 }' \
    'http://api.restlastic.com/data/v1/products'
```

Now you got
- GET, POST , PUT, PATCH, DELETE actions available
- Pagination, fulltext search, filters operators, fields filter, subressources, hierarchical json...
- Automatically managed fields : id, creation_date and modification_date, etag
- Swagger documentation template with data example in  [swagger editor ](http://editor.swagger.io/#/?import=http://api.restlastic.com/sample/v1/products/swagger.yaml&no-proxy)
- [Postman]([http://api.restlastic.com/sample/v1/products/postman.json) request template
- Access to kibana for dashboarding your data
- Modular and scalable on premise solution with restlastic, sails.js, elasticsearch, kibana

Also when doing requests, its good to know that
- Your request body JSON should be object enclosed, just like the GET output. (for example `{"name": "Foobar"}`)
- Id values are not mutable. Any `id` value in the body that differ from id in url will send an error
- A POST, PUT or PATCH request should include a `Content-Type: application/json` header to use the JSON in the request body. Otherwise it will result in a 200 OK but without changes being made to the data.

## Install

You can install Restlastic with `docker-compose`, `npm` (if elasticsearch already installed) or use `cloud demo beta`

### with docker

It will install restlastic, elasticsearch and kibana
```bash
$> git clone https://github.com/restlatic/restlatic.git
$> cd restlastic
$> docker-compose up -d
```

Then use http://localhost (api), http://localhost:9200 (elasticsearch), http://localhost:5601 (kibana)

### with npm

You must have elasticsearch already installed
```bash
$> npm install restlastic
$> npm start
```

Then use http://localhost:1337

### Use the beta online demo

/!\ All data are deleted each day

Use api.restlatic.com, elastic.restlatic.com, kibana.restlatic.com

## Routes

Based on the previous POST command, here are all the default routes. You can also add your own routes using [sails.js routes](http://sailsjs.org/documentation/concepts/routes).

### Plural routes

```
 GET sample/v1/products
 GET sample/v1/products/search?q=
 GET sample/v1/products/:id
 POST sample/v1/products
 POST sample/v1/products/:id
 PATCH sample/v1/products/:id
 PUT sample/v1/products/:id
 DELETE sample/v1/products/:id
 GET sample/v1/products/swagger.yaml
 GET sample/v1/products/postman.json
```

### Partial data

Add `fields=` to retrieve only some fields (Use `.` to access deep properties)

```
  GET sample/v1/products/:id?fields=id,name,creation_date
  GET sample/v1/products?fields=id,name
  GET sample/v1/products?fields=adress
  GET sample/v1/products?fields=adress.locality
```

### Filter

Use `.` to access deep properties

```
GET sample/v1/products?title=elastifull&author=clodio
GET sample/v1/products?id=1,2
GET sample/v1/products?id=1&id=2
GET sample/v1/products?author.name=clodio
```

### Slice

Add `start_index` and/or `count` (`pagination` and `total_results` will be included in response with `next` and `previous` link)


```
GET sample/v1/products?start_index=20
GET sample/v1/products?start_index=20&count=3
 {
   "data":[...],
   "paging": {
     "total_results":30,
     "prev": "http://api.restlastic.com/sample/v1/products?start_index=17&count=3",
     "next": "http://api.restlastic.com/sample/v1/products?start_index=23&count=3",
   }
 }
```


### Operators

Add `_gte`,`_lte`,`_gt`,`_lt` for getting a range

```
GET sample/v1/products?price_gte=10&price_lte=20
GET sample/v1/products?creation_date_gte=now-1d/d
GET sample/v1/products?creation_date_gte=now-1d
GET sample/v1/products?creation_date_gte=2014-06-18T23:59:59Z
```

Add `_ne` to exclude a value

```
GET sample/v1/products?price_ne=20
```

add `_exists=true` to find records with the field, `_exists=false` to find records without fields

```
GET sample/v1/products?address.locality_exists=true
GET sample/v1/products?address.locality_exists=false
```

Add `_like` to filter using like

```
GET sample/v1/products?title_like=server*
```

Add `_prefix` to filter with prefix

```
GET sample/v1/products?name_prefix=cl
```

Add `_regex` to filter with RegExp

```
GET sample/v1/products?name_regex=clo.?dio
```

Add `_fuzzy` to filter with fuzzy search

```
GET sample/v1/products?votes_fuzzy=2 --> votes : 1,2,3
GET sample/v1/products?name_fuzzy=cladio --> name : clodio
GET sample/v1/products?votes_fuzzy=cldio --> name : clodio
```

### Full-text search

Add `/search?q=` to do a full search on all fields

```
GET sample/v1/products/search?q=*c
```

### Relationships

Ressources can be linked to others with a `_`, in this case `subRessource` will have a `products_id` field with the value :id

 ```
 GET sample/v1/products/:id/_subRessource
 GET sample/v1/products/:id/_subRessource/search?q=
 GET sample/v1/products/:id/_subRessource/:subRessource_id
 POST sample/v1/products/:id/_subRessource
 POST sample/v1/products/:id/_subRessource/:subRessource_id
 PATCH sample/v1/products/:id/_subRessource/:subRessource_id
 PUT sample/v1/products/:id/_subRessource/:subRessource_id
 DELETE sample/v1/products/:id/_subRessource/:subRessource_id
 ```

 ### Dates

 `creation_date` and `modification_date` are automatically managed with RFC3369

 ```json
 {
   "creation_date": "2014-06-18T23:59:59Z",
   "modification_date": "2014-06-18T23:59:59Z",
 }
 ```

 You can use `now`, `now-1d`, `now+1d/d`,... when searching/filtering (see elastic.co)

   ```
   GET sample/v1/products?creation_date_gte=now-1d
   ```

### Etag

 All ressources have a version, you can use it to cache data or to modify a specific version

```
GET sample/v1/products/1
Headers :
  etag: 123456
Body:
  {
    "id":"1",
    "name":"banana",
    "etag":"123456"
  }
```
--> send a etag header and a etag inside the result

you can use header `If-None-Match` to retrieve data only if modified, to modify data only if not modified

### Automatic or managed data definitions with elasticsearch

You can create a new ressource or a new field easily by calling POST (ex : /sample/v1/products). It will create an index in elasticsearch named `sample_products`. If you want to manage precisely the types of your fields, you must use [elasticsearch mapping(https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html). By default, all the fields will considered as string, interger and dates depending on the first POST. If you want to change a type or delete a field you must delete the index before changing the mapping.

#### Retrieve mapping

```
curl -XGET http://localhost:9200/sample_products/_mapping/products
```

#### create index
```
curl -XPUT 'http://localhost:9200/sample_products/'
```

#### create mapping

```
curl -XPUT 'http://localhost:9200/sample_products/_mapping/products' \
-d'{
 "products": {
   "properties":
     {
      "creation_date":{
         "type":"date","format":"strict_date_optional_time||epoch_millis"
      },
      "etag":{
         "type":"long"
      },
      "id":{
         "type":"string"
      },
      "modification_date":{
         "type":"date","format":"strict_date_optional_time||epoch_millis"
      },
      "name":{
         "type":"string"
      },
      "price":{
         "type":"long"
      },
      "status":{
         "type":"string"
      }
    }
  }
}'
```

### Business Intelligence


Since data are stored in ELK you can make graphs with kibana, and use specific elastic request (aggregations,...). to use data you must [configure an index pattern](https://www.elastic.co/guide/en/kibana/current/setup.html#connect) corresponding to your data (/sampple/v1/products will have sample_products index)

see [kibana](https://www.elastic.co/products/kibana) for more information

### Swagger

You can get a swagger template of your Restull API

Open directly in swagger editor [http://editor.swagger.io/#/?import=http://api.restlastic.com/sample/v1/products/swagger.yaml&no-proxy](http://editor.swagger.io/#/?import=http://api.restlastic.com/sample/v1/products/swagger.yaml&no-proxy)

or download the file
```
GET http://api.restlastic/sample/v1/products/swagger.yaml
```

###  Postman

You can get a postman template of the Restull API

```
GET http://api.restlastic.com/sample/v1/products/postman.json
```



### Generate random data

You can easily create data programmatically.

```javascript
  //import-data.js
  var request = require('request');

  var dns="http://localhost:1337/sample/v1/users/";
  var body={};

  // Create 1000 users
  for (var i = 0; i < 1000; i++) {
    body = { id: i, name: 'user' + i };
    request.put({
        url: dns + i,
        body: body,
        rejectUnauthorized: false,
        json: true,
        headers: {
          'Accept-Encoding' : 'gzip', 'Authorization':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NsYXVkZS1pZHAubGFwb3N0ZS5mciIsInBybiI6ImNsYXVkZS5zZWd1cmV0QGxhcG9zdGUuZnIiLCJhdWQiOiJodHRwczovL2NsYXVkZS1hdXRoLmxhcG9zdGUuZnIiLCJleHAiOiIxNDYxNTYxNzIxIiwic2NvcGVzIjpbInJlc3NvdXJjZXMucmVhZCIsInJlc3NvdXJjZXMud3JpdGUiXX0.rn6BGkwXv1bqaevBuroqNoBDP6d8dNo3dN1f6kwPqNU'
        }
      }, function (err, res, body) {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  // Then launch $> node import-data.js
```

__Tip__ use modules like [faker](https://github.com/Marak/faker.js), [casual](https://github.com/boo1ean/casual) or [chance](https://github.com/victorquinn/chancejs) to create random semantic data.

### Add routes

You can add your own routes using [sails.js routes](http://sailsjs.org/documentation/concepts/routes) in `/config/routes.js` file.

## License

MIT - [Restlastic](https://github.com/clodio/restlastic)

## Credits

- [json-server](https://github.com/typicode/json-server)
- Homepage based on [Bootstrap](http://getbootstrap.com/) and [Bootswatch](https://bootswatch.com/)
- Icons from [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
- Web fonts from [Google](http://www.google.com/webfonts)
