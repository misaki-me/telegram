'use strict';
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const path = require('path');
const dayjs = require('dayjs');
const { segment } = require("oicq")
const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
    SecretId: '',
    SecretKey: '',
});
const Service = require('egg').Service;

class IndexService extends Service {
    async save(Buffer, extname, type, message) {
        const { ctx } = this;
        const uploadPath = 'app/public/uploads';
        const filename = `${Date.now()}.${extname}`
        const dirname = dayjs(Date.now()).format('YYYY/MM/DD')
        const mkdirsSync = dirname => {
            if (fs.existsSync(dirname)) {
                return true
            } else {
                if (mkdirsSync(path.dirname(dirname))) {
                    fs.mkdirSync(dirname)
                    return true
                }
            }
        }
        mkdirsSync(path.join(uploadPath, dirname))
        const target = path.join(uploadPath, dirname, filename)
        try {
            await fs.writeFileSync(target, Buffer)
        } catch (error) {
            await sendToWormhole
            this.ctx.throw(500, error)
        }
        return this.sendGroupMsg(type, `${dirname}/${filename}`, message)
    }
    async sendGroupMsg(type, url, message) {
        const { app, config: { groupIDs } } = this;
        let netUrl = 'https://test/public/uploads/' + url
        let localUrl = path.resolve(__dirname, `../public/uploads/${url}`)
        let title = ''
        let subTitle = ''
        if (message.includes('\n')) {
            [title, subTitle] = message.split('\n')
        } else {
            let reg = RegExp(/form|via|by/);
            reg.test(message) ? subTitle = message : title = message
        }
        if (message.includes('nsfw') || message.includes('NSFW')) {
            groupIDs.forEach(id => app.client.sendGroupMsg(id, '🔞NSFW⚠提前预警⚠'))
            // type = 'nsfw'
        }
        console.log(`类型：${type}`);
        console.log(`本地路径：${localUrl}`);
        console.log(`网络路径：${netUrl}`);
        switch (type) {
            case 'image':
                try {
                    groupIDs.forEach(id => app.client.sendGroupMsg(id, [segment.image(netUrl), title]))
                    await this.sendChannelMsg(title, subTitle, netUrl)
                } catch (error) {
                    
                }
                break;
            case 'video':
                try {
                    groupIDs.forEach(id => app.client.sendGroupMsg(id, segment.video(localUrl)))
                } catch (error) {
                    
                }
                break;
            case 'nsfw':
                try {
                    groupIDs.forEach(id => app.client.sendGroupMsg(id, segment.share(netUrl)))    
                } catch (error) {
                    
                }
                break;
        }
        return true;
    }
    async sendChannelMsg(title, subTitle, netUrl) {
        const { ctx, app, config: { guild } } = this;
        try {
            let { data } = await app.QQbot.messageApi.postMessage(guild.channelId, {
                "ark": {
                    "template_id": 37,
                    "kv": [{
                        "key": "#PROMPT#",
                        "value": "通知提醒"
                    }, {
                        "key": "#METATITLE#",
                        "value": title
                    }, {
                        "key": "#METASUBTITLE#",
                        "value": subTitle
                    }, {
                        "key": "#METACOVER#",
                        "value": netUrl
                    }, {
                        "key": "#METAURL#",
                        "value": netUrl
                    }]
                }
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    //腾讯云oss
    upload(stream) {
        const filename = Date.now() + path.extname(stream.filename).toLocaleLowerCase();
        return new Promise((resolve, reject) => {
            cos.putObject({
                Bucket: '', /* Bucket,名称 必须 */
                Region: '',    /* 所属地域 必须 */
                Key: filename,            /* 必须 */
                Body: stream, // 上传文件对象
                onProgress: function (progressData) {
                    console.log(JSON.stringify(progressData));//返回信息，包括路径
                }
            }, (err, data) => err ? reject(err) : resolve('https://' + data.Location));
        })
    }
}

module.exports = IndexService;
