import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use((req: express.Request, res: express.Response, next: Function) => {
  if (!req.url.endsWith('.jpg')) {
    // console.log('ACCESS LOG', req.url);
  }
  next();
});

app.get('/:addr.png', (req: express.Request, res: express.Response) => {
  const { addr } = req.params; // token is address
  // TODO check if address is valid
  res.sendFile(path.join(__dirname, '../assets', 'default.png'));
});

app.get('/:token', (req: express.Request, res: express.Response) => {
  const { token } = req.params; // token is address
  // TODO check if address is valid
  const domain = req.get('host');
  const protocol = req.protocol;
  res.json({
    description: `NFT Address Option for ${token}`,
    image: `${protocol}://${domain}/${token}.png`,
  });
});

app.use((req: express.Request, res: express.Response, next: Function) => {
  res.status(404).end();
});

app.listen(parseInt(process.env.PORT ?? '5555'), '127.0.0.1', () => {
  console.log('server started', process.env.PORT ?? '5555');
});
