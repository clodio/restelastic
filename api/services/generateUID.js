

// ReportError.js - in api/services
/// use generateUID.generate(req,error,"ERR_500_004");
module.exports = {

    generate: function() {

      var randomId =shortid.generate();
      randomId=randomId.replace('_', 'A');
      randomId=randomId.replace('-', 'b');

      //@TODO : generate an external function
      var consonnes = ['b','c','d','f','g','j','k','l','m','n','p','r','s','t','v','x','z'];
      var voyelles = ['a', 'e', 'i', 'o', 'u'];
      var desChiffresEtDesLettres = consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] + consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] +consonnes[Math.floor(Math.random() * 17)] + voyelles[Math.floor(Math.random() * 5)] + ('00' +Math.floor(Math.random() * 100)).slice(-3);
      randomId = desChiffresEtDesLettres + randomId;
      return randomId;
    }
};
