const bodyParser = require('body-parser');
const express = require('express');

class TokenReceiver {
  constructor(port) {
    this.port = port;
  }

  hostReceiver() {
    this.host = express();
    this.host.use(bodyParser.urlencoded({ extended: true }));

    this.host.listen(this.port, () => {
      console.log('server is running');
    });
    
    this.host.post('/token', (req, res) => {
      this.tokenToSend = req.body.token;
      this.userId = req.body.userId;
      this.email = req.body.email;
      console.log(this.tokenToSend);
      console.log(this.userId);
      console.log(this.email);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        token: 'OK' || null,
      }));
    });
  }
}

module.exports = TokenReceiver;