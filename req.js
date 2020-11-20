const fs= require('fs')
const http = require('http')
const https = require('https')

/*
echo | openssl s_client -servername baltimore-cybertrust-root-revoked.chain-demos.digicert.com  -connect baltimore-cybertrust-root-revoked.chain-demos.digicert.com :443 -showcerts
openssl verify -CAfile <(cat digi2.pem bundle.pem.crl)  baltimore-cybertrust-root-revoked.chain-demos.digicert.com
openssl verify -CAfile <(cat digi2.pem bundle.pem.crl) -crl_check  baltimore-cybertrust-root-revoked.chain-demos.digicert.com

https://ssl-tools.net/subjects/c12f4576ed1559ecb05dba89bf9d8078e523d413
https://crt.sh/?caid=8
https://crt.sh/?caid=11123
https://www.ssl.com/article/how-do-browsers-handle-revoked-ssl-tls-certificates/

*/

// https://knowledge.digicert.com/generalinformation/INFO4629.html
const secure = {
       protocol: 'https:',
      //host: 'linuxfr.org', 
      //host: 'revoked.grc.com', 
      //host: 'knowledge.digicert.com', 
      //host: 'revoked.badssl.com',
      host: 'baltimore-cybertrust-root-revoked.chain-demos.digicert.com',
      port: 443,
      path: '/',
      method: 'GET',
      ca: fs.readFileSync('digi2.pem'),
	/*
      ca: fs.readFileSync('DigiCertSHA2SecureServerCA.pem.crt'),
      crl: fs.readFileSync('plop.pem.crl'),
	crl: fs.readFileSync(process.argv[2]),
      //*/
      /*/
      crl: [
      fs.readFileSync('ssca-sha2-g5.pem.crl', 'utf8'),
        fs.readFileSync('ssca-sha2-g5.pem.crl', 'utf8'),
	fs.readFileSync('sha2-ha-server-g5.pem.crl', 'utf8'),
        fs.readFileSync('evca-g3-group1.pem.crl', 'utf8'),
        fs.readFileSync('DigiCertGlobalCAG2.pem.crl', 'utf8')
      ],
      //*/
      rejectUnauthorized: true,
      requestCert: true,
      agent: false
};

//console.log(secure.crl)

const req = https.request(secure, (response) => {
      let socket = response.socket
      console.log(socket.authorized)
      console.log(socket.getPeerCertificate(false))
      let str = '';
      response.on('data', chunk => str += chunk)
      response.on('end', () => console.log(str.substr(0,10) + '...'))
})
req.on('error', (e)=> console.log(e))
req.end()
