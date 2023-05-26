const fs = require('fs');
const ssh2 = require('ssh2');

const SSH2_FX_FAILURE = 4
const SSH2_FX_OK = 0

const privateKeyPath = '/Users/yongsunglee/.ssh/gcp_ed25519';
const serverPort = 11115;

const allowedUser = 'tester';
const allowedPublicKey = `-----BEGIN PUBLIC KEY-----
... Paste the allowed public key here ...
-----END PUBLIC KEY-----`;

const server = new ssh2.Server({
	hostKeys: [fs.readFileSync(privateKeyPath)],
});

server.on('connection', (client) => {
	console.log('Client connected');

	client.on('authentication', (ctx) => {
		if (
			ctx.method === 'publickey' &&
			ctx.username === allowedUser &&
			ctx.key.algo === 'ssh-ed25519' // &&
	// 		ctx.key.data.toString('base64') === allowedPublicKey
		) {
			ctx.accept();
		} else {
			ctx.reject();
		}
	});

	client.on('ready', () => {
		console.log('Client authenticated and ready');

		client.on('session', (accept) => {
			const session = accept();

			session.on('sftp', (accept, reject) => {
				const sftp = accept();

				sftp.on('OPEN', (reqid, filename, flags, attrs) => {
					console.log('File opened:', filename);
					const handle = Buffer.from(`${filename}-handle`);

					sftp.handle(reqid, handle);
				});

				sftp.on('WRITE', (reqid, handle, offset, data) => {
					const filePath = handle.toString().replace('-handle', '');

					console.log('Writing data to:', filePath);

					fs.appendFile(filePath, data, (err) => {
						if (err) {
							console.error('Error writing file:', filePath, err);
							sftp.status(reqid, SSH2_FX_FAILURE);
						} else {
							sftp.status(reqid, SSH2_FX_OK);
						}
					});
				});

				sftp.on('CLOSE', (reqid, handle) => {
					const filePath = handle.toString().replace('-handle', '');
					console.log('File closed:', filePath);
					sftp.status(reqid, SSH2_FX_OK);
				});
			});
		});
	});

	client.on('end', () => {
		console.log('Client disconnected');
	});
});

server.listen(serverPort, () => {
	console.log(`SFTP server started on port ${serverPort}`);
});
