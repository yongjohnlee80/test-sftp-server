const fs = require('fs');
const { Client } = require('ssh2');

const privateKeyPath = '/Users/yongsunglee/.ssh/gcp_ed25519';
const serverHost = '127.0.0.1';
const serverPort = 11115;
const username = 'tester';
const remoteFilePath = '/files/uploaded_file.txt';
const localFilePath = 'hello.txt';

const privateKey = fs.readFileSync(privateKeyPath);

const client = new Client();

client.on('ready', () => {
	console.log('Client connected');

	client.sftp((err, sftp) => {
		if (err) {
			console.error('Error creating SFTP session:', err);
			client.end();
			return;
		}

		const readStream = fs.createReadStream(localFilePath);
		const writeStream = sftp.createWriteStream(remoteFilePath);

		writeStream.on('close', () => {
			console.log('File uploaded successfully');
			client.end();
		});

		writeStream.on('error', (err) => {
			console.error('Error uploading file:', err);
			client.end();
		});

		readStream.pipe(writeStream);
	});
});

client.on('error', (err) => {
	console.error('Error connecting to server:', err);
});

client.connect({
	host: serverHost,
	port: serverPort,
	username: username,
	privateKey: privateKey,
});
