import * as midtransClient from 'midtrans-client';


let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'YOUR_SERVER_KEY',
  clientKey: 'YOUR_CLIENT_KEY'
});

export default snap;