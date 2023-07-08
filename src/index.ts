import express from 'express';
import path from 'path';
import cors from 'cors';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { isValidEthereumAddress, uint256ToAddress } from './helpers';

registerFont(path.join(__dirname, '../assets', 'OpenSans-Regular.ttf'), {
  family: 'Open Sans',
});

const app = express();
app.use(cors());
app.use((req: express.Request, res: express.Response, next: Function) => {
  if (!req.url.endsWith('.jpg')) {
    console.log('ACCESS LOG', req.url);
  }
  next();
});

app.get('/:addr.png', (req: express.Request, res: express.Response) => {
  const { addr } = req.params; // token is address
  if (!isValidEthereumAddress(addr)) {
    res.status(404).end();
    return;
  }
  const canvas = createCanvas(512, 512);
  const context = canvas.getContext('2d');
  loadImage(path.join(__dirname, '../assets', 'default.png')).then((image) => {
    context.drawImage(image, 0, 0, 512, 512);
    context.font = '20px Open Sans';
    context.fillStyle = '#FFFFFF';
    context.strokeStyle = '#000000';
    context.lineWidth = 3;

    // Position and draw the text on the canvas
    const textX = canvas.width / 2 - context.measureText(addr).width / 2; // Center the text horizontally
    const textY = canvas.height / 2 + 220; // Center the text vertically with some offset
    context.strokeText(addr, textX, textY);
    context.fillText(addr, textX, textY);

    // Convert the canvas to a PNG buffer
    const buffer = canvas.toBuffer('image/png');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  });
  // TODO check if address is valid

});

app.get('/:token', (req: express.Request, res: express.Response) => {
  const { token } = req.params;
  const address = uint256ToAddress(token);
  if (!isValidEthereumAddress(address)) {
    res.status(404).end();
    return;
  }
  // TODO check if address is valid
  const domain = req.get('host');
  const protocol = req.protocol;
  res.json({
    description: `NFT Address Option for ${address}`,
    image: `${protocol}://${domain}/${address}.png`,
  });
});

app.use((req: express.Request, res: express.Response, next: Function) => {
  res.status(404).end();
});

app.listen(parseInt(process.env.PORT ?? '5555'), '127.0.0.1', () => {
  console.log('server started', process.env.PORT ?? '5555');
});
