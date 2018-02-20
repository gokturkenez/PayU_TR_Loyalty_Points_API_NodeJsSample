/*
Author: Gokturk Enez
Mail: hi@gokturkenez.com.tr
Description: PayU Turkey Loyalty Points Query Service Node JS Sample Code
*/

var EndPointUrl = 'https://secure.payu.com.tr/api/loyalty-points/check';

SecretKey = 'SECRET_KEY';

var moment = require('moment');
date = moment.utc().format('YYYY-MM-DD HH:mm:ss').toString();
ORDER_REF = Math.floor(Math.random() * Math.floor(1000));


var array = {
    'MERCHANT': 'OPU_TEST',
    'CC_OWNER': 'Gokturk Enez',
    'CC_NUMBER': '4355084355084358',
    'EXP_MONTH': '12',
    'EXP_YEAR': '2018',
    'CC_CVV': '000',
    'CURRENCY':'TRY',
    'DATE': date

};

hashstring = '';
var sortKeys = require('sort-keys');
sorted = sortKeys(array);
for (var k in sorted) {
    hashstring += array[k].length + array[k] ;
}

var hash = require('crypto')
    , data = hashstring
    , secretkey = SecretKey;

signature = hash.createHmac('md5', secretkey).update(data).digest('hex');
array['HASH'] = signature;

var request = require("request");
var parseString = require('xml2js').parseString;
request.post(EndPointUrl, {form:array}, function(error, response, body) {
    parseString(body, function (err, result) {
        var parsedXML = result['EPAYMENT'];
        if (parsedXML["STATUS"] == "SUCCESS" && parsedXML["RETURN_CODE"] == "3DS_ENROLLED") {
            console.log("You should make rediretction to",parsedXML["URL_3DS"],"for completing transaction")
            console.log(body)
        }
        else {
            console.log(body);

        }
    });


});
