# test-sftp-server
This is a sample sftp server node application for testing DDEX distribution.
server port is already set to 11115 to mimic Medal DDEX Recipient

### Setup
1. You will require to set up ssh key for sftp protocol
Make sure to set the private key path correctly in sftp-server.js
2. In your lm config file, you would also have to set these following vars
```shell
SSHPrivateKeyFile=".../.ssh/ed25519"
SSHPublicKeyFile=".../.ssh/ed25519.pub"
```
* NOTE: fake ssh key can be used, as there isn't any validation logic. 
If authentication testing is necessary, implement the logic in sftp-client.js, 
on event, "authentication"

### Usage

SFTP server application
```shell
node sftp-server.js
```

To test the server is working as intended, you can run
```shell
node sftp-client.js
```

This will upload the file, `uploaded_file.txt` in the folder, `/files`