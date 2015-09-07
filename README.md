Dependencies:

mongodb, nodejs, npm

Installation:

```
git clone https://github.com/darkdigitaldream/twitterDemo.git
cd twitterDemo
npm install
```


add file "../twitterCredentials.json" and fill out the following:

```
{
	"consumer_key": "",
	"consumer_secret": "",
	"access_token_key": "",
	"access_token_secret": ""
}
```

you can run the test suite to ensure the environment is properly configured.

Testing: 

Tests must be run as root to bind to port 80
run the test suite by issuing the following command:

```
sudo npm test
```

Deploying:

make sure you have root permissions to bind to port 80

```
cd twitterDemo
sudo node src/server/server.js & 
```

Troubleshooting:

if Twitter API fails to authenticate, it is posible the server time may be drifting.

```
sudo ntpdate ntp.ubuntu.com
```

