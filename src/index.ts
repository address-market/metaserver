import express from 'express';
import path from 'path';
import cors from 'cors';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { isValidEthereumAddress, uint256ToAddress } from './helpers';
import { checksumAddress } from 'viem';
import { getAddressDescription } from './semantics';

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
  const { addr: _addr } = req.params; // token is address
  const bound = Boolean(req.query.bound);
  if (!isValidEthereumAddress(_addr)) {
    res.status(404).end();
    return;
  }
  const addr = checksumAddress(_addr as `0x${string}`);
  const addressPart1 = addr.slice(0, 22);
  const addressPart2 = addr.slice(22);
  // console.log('addressPart1', addressPart1);
  // console.log('addressPart2', addressPart2);
  const canvas = createCanvas(512, 512);
  const context = canvas.getContext('2d');
  loadImage(path.join(__dirname, '../assets', bound ? 'bound.png' : 'default.png')).then((image) => {
    context.drawImage(image, 0, 0, 512, 512);
    context.font = '28px Open Sans';
    context.fillStyle = '#132939';
    // context.strokeStyle = '#000000';
    // context.lineWidth = 2;

    {
      const textX = canvas.width / 2 - context.measureText(addressPart1).width / 2;
      const textY = canvas.height / 2 + 145;
      // context.strokeText(addressPart1, textX, textY);
      context.fillText(addressPart1, textX, textY);
    }
    {
      const textX = canvas.width / 2 - context.measureText(addressPart2).width / 2;
      const textY = canvas.height / 2 + 175;
      // context.strokeText(addressPart2, textX, textY);
      context.fillText(addressPart2, textX, textY);
    }

    const subtext = getAddressDescription(addr);
    {
      context.font = '24px Open Sans';
      // context.fillStyle = '#ffffff';

      const textX = canvas.width / 2 - context.measureText(subtext).width / 2;
      const textY = canvas.height / 2 - 215;
      // context.strokeText(subtext, textX, textY);
      context.fillText(subtext, textX, textY);
    }

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
  try {
    BigInt(token);
  } catch (e) {
    res.status(404).end();
    return;
  }
  const address = uint256ToAddress(token);
  if (!isValidEthereumAddress(address)) {
    res.status(404).end();
    return;
  }
  // TODO check if address is valid
  const domain = req.get('host');
  const protocol = req.protocol;
  res.json({
    description: `Address NFT for ${address}`,
    name: `Address NFT ${address}`,
    image: `${protocol}://${domain}/${address}.png`,
  });
});

app.get('/bound/:token', (req: express.Request, res: express.Response) => {
  const { token } = req.params;
  try {
    BigInt(token);
  } catch (e) {
    res.status(404).end();
    return;
  }
  const address = uint256ToAddress(token);
  if (!isValidEthereumAddress(address)) {
    res.status(404).end();
    return;
  }
  // TODO check if address is valid
  const domain = req.get('host');
  const protocol = req.protocol;
  res.json({
    description: `Bound Address NFT for ${address}. Not transferable and not sellable.`,
    name: `Bound Address NFT ${address}`,
    image: `${protocol}://${domain}/${address}.png?bound=1`,
  });
});

app.use((req: express.Request, res: express.Response, next: Function) => {
  res.status(404).end();
});

app.listen(parseInt(process.env.PORT ?? '5555'), '127.0.0.1', () => {
  console.log('server started', process.env.PORT ?? '5555');
});
