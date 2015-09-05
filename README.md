Dependencies:

mongodb, nodejs, npm

Installation:

```
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

Troubleshooting:

if Twitter API fails to authenticate, it is posible the server time may be drifting.

```
sudo ntpdate ntp.ubuntu.com
```

