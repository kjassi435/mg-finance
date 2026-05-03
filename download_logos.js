const fs = require('fs');
const path = require('path');
const https = require('https');

const ids = [
  '1ItRtaFroSomVUndlbzZMNjaFPY0oKcUr',
  '12fyFIqGV7aVyKGg7GHwGi0C6djbEdzj3',
  '1d2mx7JbYHinhOBVB6AR9xtRIGPU-PWhk',
  '1P1Q_RosZRqla-MQ2k_jdFvPbVP2He91e',
  '1O5PZIoET9iPaAdK3sn_bOv0t6MkxnOpC',
  '1RotC_79b2df8APMcY5ikFOVsBUHky9eQ',
  '1eSvaDxV2mtVgHdnpzmohT37pMwzfbuhq',
  '1W_bWsOvkvbON0OZ3x8xVOBmuEdxaKNHk',
  '18JWV34B8Jz-Ae6oVn6bylZSN9lgpwiSe',
  '1W9RnUIz1RA9TUULc2q7tp77WZEDqdkBf',
  '1SNAFHdbv3hsatSFH5MNAA7UeiEwdUnex',
  '1_uf9Ymg9jeLHLDajWIoNm4OBH0uUouS4'
];

const dir = path.join(__dirname, 'public', 'images', 'partners');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 301) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      } else {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

async function download() {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const url = `https://drive.google.com/uc?export=download&id=${id}`;
    const dest = path.join(dir, `logo-${i + 1}.png`);
    await downloadFile(url, dest);
    console.log(`Downloaded logo-${i + 1}.png`);
  }
}

download().then(() => console.log('Done')).catch(console.error);
