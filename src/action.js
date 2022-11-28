import path from 'node:path';
import got from 'got';
import fs from 'fs-extra';
import Conf from 'conf';
import download from 'download';
import { gzip } from 'compressing';
import envPaths from 'env-paths';
import pkgData from './pkg.js';
import csv from 'csvtojson';

const envPath = envPaths(pkgData.name, { suffix: '' });
const config = new Conf({ projectSuffix: '', projectName: pkgData.name });
const cachePath = path.join(envPath.cache, 'cache');

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

if (!fs.existsSync(cachePath)) {
  mkdirsSync(cachePath);
}

export class GIO {
  baseUrl = 'https://www.growingio.com';

  constructor() {
    this.ai = config.get('ai', '');
    this.authorization = config.get('authorization', '');
  }

  fetch(url, params = {}) {
    const headers = params.headers || {};
    if (!headers.Authorization) {
      headers.Authorization = this.authorization;
    }
    const fetchParams = {
      ...params,
      headers
    };
    const u = /^http/.test(url) ? url : this.baseUrl + url;
    console.error(`[fetch] ${u} ${JSON.stringify(fetchParams)}`);
    return got(u, fetchParams);
  }

  async download(source, onSuccess) {
    const ai = source.ai || this.ai;
    const url = `/v2/insights/${source.exportType}/${source.dataType}/${ai}/${source.exportDate}.json`;
    console.error(`[down]  url ${url}`);
    try {
      const res = await this.fetch(url).catch(() => {});
      if (!res || !res.body) {
        console.error(`[down] 请求接口失败`);
        return;
      }
      const resJson = JSON.parse(res.body);
      if (resJson.status !== 'FINISHED') {
        console.error(`[down] ${JSON.stringify(resJson)}`);
        return;
      }

      const downloadLinks = resJson.downloadLinks || [];

      for (let i = 0; i < downloadLinks.length; i++) {
        const downloadLink = downloadLinks[i];
        const fileName = `${ai}.${source.exportDate}.${i + 1}.csv`;
        const filePath = path.join(cachePath, fileName);
        const gzFilePath = path.join(cachePath, fileName + '.gz');
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(gzFilePath, await download(downloadLink));
          console.log(`[下载文件] ${downloadLink}`);
          await gzip.uncompress(gzFilePath, filePath);
          fs.unlinkSync(gzFilePath);
          console.log(`[解压文件] ${gzFilePath}`);
        } else {
          console.log(`[文件已存在] ${filePath}`);
        }
        typeof onSuccess === 'function' &&
          (await onSuccess({
            fileName,
            filePath
          }));
      }
    } catch (error) {
      console.log(`[error] ${source.exportDate}`);
    }
  }

  async export(source) {
    const exportSuccess = ({ fileName, filePath }) => {
      const outPath = source.outPath || path.join(process.cwd(), fileName);
      fs.copyFileSync(filePath, outPath);
    };
    const exportDateArr = source.exportDate.split('-');
    if (exportDateArr.length === 2) {
      for (let i = exportDateArr[0]; i <= exportDateArr[1]; i++) {
        await this.download(
          {
            ...source,
            exportDate: i
          },
          exportSuccess
        );
      }
    } else {
      this.download(source, exportSuccess);
    }
  }
  async track(source) {
    const { eventId, data = '{}' } = source;
    const ai = source.ai || this.ai;
    const t = Date.now();
    const url = `https://api.growingio.com/v3/${ai}/s2s/cstm?stm=${t}`;
    await this.fetch(url, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify([
        {
          cs1: 'gio-cli',
          tm: t,
          t: 'cstm',
          n: eventId,
          var: {
            ...JSON.parse(data)
          }
        }
      ])
    });
    console.error(`[track] ${eventId}`);
  }

  async find(source) {
    await this.download(source, async ({ filePath }) => {
      const rows = await csv({
        noheader: false,
        output: 'json'
      }).fromString(fs.readFileSync(filePath, 'utf-8'));
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (row.eventName === source.eventId) {
          console.log(row);
        }
      }
    });
    console.log('done');
  }

  bind(source) {
    source.ai && config.set('ai', source.ai);
    source.authorization && config.set('authorization', source.authorization);
  }
}
