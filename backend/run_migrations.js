const crypto = require("crypto-js");
const dateFormat = require("dateformat");
const axios = require("axios");

const host = process.argv[2] === 'prod' ?
  'jacwuy85g4.execute-api.eu-west-1.amazonaws.com':
  'jacwuy85g4.execute-api.eu-west-1.amazonaws.com';
const region = 'eu-west-1';
const path = `/${process.argv[2]}/migrations`;
const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_key =  process.env.AWS_SECRET_ACCESS_KEY;
if (!secret_key || !access_key){
  throw new Error('Please provide your AWS credentials in environment variables')
}
let request_body = JSON.stringify({
  action: 'migrate'
});
if (process.argv[3] && process.argv[3]==='down') {
  request_body = JSON.stringify({
    action: 'down'
  });
}


const service = 'execute-api';
const content_type = 'application/json';

// Key derivation functions. See:
// http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
  const kRegion = crypto.HmacSHA256(regionName, kDate);
  const kService = crypto.HmacSHA256(serviceName, kRegion);
  const kSigning = crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
}

const now = new Date();
const amz_date = dateFormat(now, 'UTC:yyyymmdd"T"HHMMss"Z"');
const date_stamp = dateFormat(now, 'UTC:yyyymmdd');

// ************* TASK 1: CREATE A CANONICAL REQUEST ************* 
// http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

// Step 1 is to define the verb (GET, POST, etc.)--already done.
const method = 'POST';

// Step 2: Create canonical URI--the part of the URI from domain to query
// string (use '/' if no path)
const canonical_uri = path;

// Step 3: Create the canonical query string. In this example, request
// parameters are passed in the body of the request and the query string
// is blank.
const canonical_querystring = '';

// Step 4: Create the canonical headers. Header names must be trimmed
// and lowercase, and sorted in code point order from low to high.
  // Note that there is a trailing \n.
const canonical_headers = 'content-type:' + content_type + '\n' + 'host:' + host + '\n' + 'x-amz-date:' + amz_date + '\n';

// Step 5: Create the list of signed headers. This lists the headers
// in the canonical_headers list, delimited with ";" and in alpha order.
  // Note: The request can include any headers; canonical_headers and
// signed_headers include those that you want to be included in the
// hash of the request. "Host" and "x-amz-date" are always required.
const signed_headers = 'content-type;host;x-amz-date';

// Step 6: Create payload hash. In this example, the payload (body of
// the request) contains the request parameters.
const payload_hash = crypto.SHA256(request_body);

// Step 7: Combine elements to create canonical request
const canonical_request = method + '\n' + canonical_uri + '\n' + canonical_querystring + '\n' + canonical_headers + '\n' + signed_headers + '\n' + payload_hash;
console.log(canonical_request);
// ************* TASK 2: CREATE THE STRING TO SIGN*************
// Match the algorithm to the hashing algorithm you use, either SHA-1 or
// SHA-256 (recommended)
const algorithm = 'AWS4-HMAC-SHA256';
const credential_scope = date_stamp + '/' + region + '/' + service + '/' + 'aws4_request';
const string_to_sign = algorithm + '\n' +  amz_date + '\n' +  credential_scope + '\n' +  crypto.SHA256(canonical_request);

// ************* TASK 3: CALCULATE THE SIGNATURE *************
// Create the signing key using the function defined above.
const signing_key = getSignatureKey(secret_key, date_stamp, region, service);

// Sign the string_to_sign using the signing_key
const signature = crypto.HmacSHA256(string_to_sign, signing_key);


// ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
// Put the signature information in a header named Authorization.
const authorization_header = algorithm + ' ' + 'Credential=' + access_key + '/' + credential_scope + ', ' +  'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature;

// The request can include any headers, but MUST include "host", "x-amz-date",
  // "content-type", and "Authorization". Except for the authorization
// header, the headers must be included in the canonical_headers and signed_headers values, as
// noted earlier. Order here is not significant.
  // // Python note: The 'host' header is added automatically by the Python 'requests' library.
const headers = {'Content-Type':content_type,
  'X-Amz-Date':amz_date,
  'Authorization':authorization_header};

// ************* SEND THE REQUEST *************

console.log('Sending migration request...');

axios.post('https://'+host+path, request_body, {
  headers,
}).then(function (response) {
  console.log('Done');
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});
