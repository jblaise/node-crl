const fs= require('fs')
const http = require('http')
const https = require('https')

const unsecure = {
      host: 'linuxfr.org', 
      path: '/',
      method: 'GET'
};

// https://knowledge.digicert.com/generalinformation/INFO4629.html
const secure = {
      //host: 'linuxfr.org', 
      //host: 'revoked.grc.com', 
      host: 'knowledge.digicert.com', 
      port: 443,
      path: '/',
      method: 'GET',
      crl: [
        fs.readFileSync('ssca-sha2-g5.pem.crl', 'utf8'),
	fs.readFileSync('sha2-ha-server-g5.pem.crl', 'utf8'),
        fs.readFileSync('evca-g3-group1.pem.crl', 'utf8'),
        fs.readFileSync('DigiCertGlobalCAG2.pem.crl', 'utf8')
      ],
      rejectUnauthorized: true,
      requestCert: true,
      agent: false
};

console.log(secure.crl)

//const req = http.request(unsecure, (response) => {
const req = https.request(secure, (response) => {
      let socket = response.socket
      console.log(socket.authorized)
      console.log(socket.getPeerCertificate(false))
      let str = '';
      response.on('data', chunk => str += chunk)
      response.on('end', () => console.log(str.substr(0,10) + '...'))
}).end();
