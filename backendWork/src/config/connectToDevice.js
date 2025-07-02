const net = require('net');

const DEVICE_IP = '192.168.1.225';
const DEVICE_PORT = 5500;
const retryInterval = 5000; // Retry every 5 seconds

const connectToDevice = async () => {
  const client = new net.Socket();
  let fullData = Buffer.alloc(0);

  client.connect(DEVICE_PORT, DEVICE_IP, () => {
    console.log('✅ Connected to Realand device');

    // Example command to request data/logs
    const command = Buffer.from([0x7E, 0x00, 0x08, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]);
    client.write(command);
  });

  client.on('data', (data) => {
    fullData = Buffer.concat([fullData, data]);
  });

  client.on('end', () => {
    console.log('Data fully received from device:');
    console.log(fullData.toString('hex')); // Show hex log in console
  });

  client.on('error', (err) => {
    console.error('Connection failed:', err.message);
    console.log(`Retrying in ${retryInterval / 1000} seconds...`);
    client.destroy();
    setTimeout(connectToDevice, retryInterval);
  });


  client.on('close', () => {
    console.log('🔌 Connection closed');
  });
}


module.exports = {connectToDevice}