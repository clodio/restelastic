var jwt = require('jwt-simple');
var secret = 'MIICcwIBADANBgkqhkiG9w0BAQEFAASCAl0wggJZAgEAAoGBAM6LywlGYW0q06Hk\n+W5eVkWmF96tnSbuExI4CsFQKOVr0Sl0PSewKA+jIHaN3mH40j8gm7FTIA9SNQBf\nlkxEoGluYb6I2R9SFdTNWBDF77mU+pzKJjv57402BS6DPVNIz+Rp9zNkkbM39xgu\n+srVQ1NELEfMd3alLFThAC7muqmtAgMBAAECf3XLRAAGI4oe4pNyAs7u/kS6dOKK\nIRYSsM2zKG8XSDuPQbpikH4R+MbyQZFbV3iIb1+ROTnoLmCOgau02AKnINP51fv0\nEO987hivmI7vl5LPT2+q347IJKgHVoelYV2J/BVi6V/+J+Jvd+vlYOoz97SKVdpk\nzGEoMTXH/OezuzkCQQDnTHLShjthWAZ3NDU/fOVwnkLXiGM0qm+SkmCxOdiHmo4B\nixqNMpCe0UHZi2MXwKp7qZOaM8uem0IzfX7gzCNbAkEA5JqgPwCsnNARo9SGbaMI\nCkNfPzmBtEKYE61w6rgP7+/cxVy8E8+Rx98TEIaICR0fIBxQueOglVhR2P+7Flmd\nlwJAVxeVIKpEj6nafWYeKrK3ngkpeAi1+i2250TQvcrfOmg60l/zdnk0tWhr2CNB\nA7+bMgcvOeAI6sbhTYwSi0iygwJAKk7Xs3FLgOYdLaXqjyXqGgQn/4qED7l3bcTe\nrgIMqQpKYJhuEniK8WO+ooNTb+Rc21OCOTUAhkNHOpLxrAw/1wJAYhdhQ0TTVNx6\nnv0ktTZBpvnUGFOuUeJKk8ewhFYPdjVt9BYL2rW9M2NEVEcBh15NJ1qRmbmC8PJC\naYIIo6LkAQ\u003d\u003d';
// ReportError.js - in api/services
/// use ReportError.error(req,error,"ERR_500_004");
module.exports = {

    error: function(req, error, error_id) {

      var client="unknown";

      if (req.headers.authorization) {
        client = jwt.decode(req.headers.authorization, secret).iss || "unknown";
      }
      sails.log.error({"error":error,"client":client,"http_verb":req.method,"url":req.url,"error_id":error_id});

    }
};
