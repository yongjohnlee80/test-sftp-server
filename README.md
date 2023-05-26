# test-sftp-server
This is a sample sftp server node application for DDEX testing
server port is already set to 11115 to mimic Medal DDEX Recipient

### Setup
You will require to set up ssh key for sftp protocol
Make sure to set the private key path correctly in sftp-server.js


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