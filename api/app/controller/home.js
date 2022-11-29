'use strict';
const input = require("input");
const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions/index.js");
const { NewMessage } = require("telegram/events/index.js");
const { createClient, segment } = require("oicq")
const path = require('path');
const { GuildApp } = require("oicq-guild")
const { createOpenAPI, createWebsocket } = require('qq-guild-bot');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async upload() {
    const { ctx, service } = this;
    ctx.$success({
      url: await service.index.getImgUrl(await ctx.getFileStream())
    })
  }
  async v2Ray() {
    const { ctx, config: { v2Ray } } = this;
    ctx.set('content-type', 'text/plain;charset=utf-8');
    ctx.body = v2Ray;
    ctx.status = 200;
  }
  async telegram() {
    const { ctx, service, config: { telegram: { apiId, apiHash, token } } } = this;
    const session = new StringSession(token); // You should put your string session here
    const client = new TelegramClient(session, apiId, apiHash, {});
    // await client.start({
    //   phoneNumber: async () => await input.text("number ?"),
    //   password: async () => await input.text("password?"),
    //   phoneCode: async () => await input.text("Code ?"),
    //   onError: (err) => console.log(err),
    // });
    await client.connect();
    console.log(client.session.save()); // Save this string to avoid logging in again

    //要监视下载的频道,键名无实际作用
    const channel = [
      // {
      //   name: "每日傻雕墙",
      //   id: -1001341930464
      // }
      // {
      //   name: '心惊报',
      //   id: -1001434817225
      // },
      {
        name: "奇闻异录与沙雕时刻",
        id: -1001214996122
      }]
    const result = await client.invoke(
      new Api.channels.GetChannels({
        id: channel.map(v => v.id)
      })
    );
    client.addEventHandler(async ({ message }) => {
      if (message.media != null) {
        console.log(message);
        let extname = 'png';
        let type = 'image';
        let { photo = null, document = null } = message.media;
        if (document) {
          let { mimeType } = document;
          let arr = mimeType.split('/');
          type = arr[0];
          extname = arr[1];
        }
        const buffer = await client.downloadMedia(message.media);
        await service.index.save(buffer, extname, type, message.message);
      }
    }, new NewMessage({ chats: result.chats.map(v => v.id) }))
    console.log('电报启动成功！');
    ctx.$success('电报启动成功！')
  }
  async oicq() {
    const { ctx, app, service, config: { QQaccount } } = this;
    /** 1:安卓手机(默认) 2:aPad 3:安卓手表 4:MacOS 5:iPad */
    app.client = createClient(QQaccount.account, {
      platform: 5,
      resend: false,
      ffmpeg_path: '/ffmpeg/ffmpeg',//注意：这里的路径是软件路径，不是依赖包路径
      data_dir: process.cwd() + '/data'
    })

    let message = '';
    //在线
    app.client.on("system.online", async () => {
      console.log('QQ启动成功!');
      await this.QQbot();
      await this.telegram();
    })
    //扫码登录
    app.client.on('system.login.qrcode', function (e) {
      console.log('扫码后按Enter回车完成登录')
      process.stdin.once('data', () => this.login())
    })

    //密码登录
    app.client.on('system.login.slider', function (e) {
      service.oicq.slider(e)
      // process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
    })
    // 设备锁
    app.client.on('system.login.device', async function (event) {
      service.oicq.device(event)
    })

    // 登录错误
    app.client.on('system.login.error', async function (event) {
      message = await service.oicq.error(event)
    })

    app.client.login(QQaccount.password)
    // app.client.login()

    // 绑定频道
    // app.client = GuildApp.bind(app.client);

    // app.client.on("ready", function () {
    //   console.log("My guild list:")
    //   console.log(this.guilds)
    // })

    // app.client.on("message", data => {
    //   console.log(data);
    // })

    await ctx.sleep(1000);
    message ? ctx.$fail('QQ启动失败！', message) : ctx.$success('QQ启动成功！');
    // process.exit()
  }
  async snedTestMessage() {
    const { ctx, app, service, config: { groupIDs } } = this;
    // groupIDs.forEach(id => app.client.sendGroupMsg(id, segment.video(path.resolve(__dirname, '../public/2.mp4'))).catch(err => console.log(err)))
    await service.index.sendChannelMsg('标题', '子标题', 'https://test/public/11.jpg');
    ctx.$success('发送成功！')
  }
  async QQbot() {
    const { ctx, app, config: { QQbot } } = this;
    // 创建 client
    app.QQbot = createOpenAPI(QQbot);
    // 创建 websocket 连接
    app.ws = createWebsocket(QQbot);
    app.ws.on('gateway', data => {
      console.log('[gateway] 事件接收 :', data);
    });
    // ws.on('READY', data => {
    //   console.log('[READY] 事件接收 :', data);
    // });
    app.ws.on('ERROR', data => {
      this.QQbot();
      console.log('[ERROR] 事件接收 :', data);
    });
    // ws.on('GUILDS', data => {
    //   console.log('[GUILDS] 事件接收 :', data);
    // });
    // ws.on('GUILD_MEMBERS', data => {
    //   console.log('[GUILD_MEMBERS] 事件接收 :', data);
    // });
    // ws.on('GUILD_MESSAGES', data => {
    //   console.log('[GUILD_MESSAGES] 事件接收 :', data);
    // });
    // ws.on('GUILD_MESSAGE_REACTIONS', data => {
    //   console.log('[GUILD_MESSAGE_REACTIONS] 事件接收 :', data);
    // });
    // ws.on('DIRECT_MESSAGE', data => {
    //   console.log('[DIRECT_MESSAGE] 事件接收 :', data);
    // });
    app.ws.on('PUBLIC_GUILD_MESSAGES', async ({ eventType, msg }) => {
      let [BotId, instruct, content] = msg.content.split(' ')
      if (eventType == 'AT_MESSAGE_CREATE' && instruct == '/加一') {
        await app.QQbot.messageApi.postMessage(msg.channel_id, {
          content,
          message_reference: {
            message_id: msg.id
          }
        });
      }
      // console.log('当收到@机器人的消息时:', msg);
    });
    // app.ws.on('MESSAGE_AUDIT', data => {
    //   console.log('消息审核事件接收 :', data);
    // });
    // ws.on('FORUMS_EVENT', data => {
    //   console.log('[FORUMS_EVENT] 事件接收 :', data);
    // });
    // ws.on('AUDIO_ACTION', data => {
    //   console.log('[AUDIO_ACTION] 事件接收 :', data);
    // });
    // ws.on('PUBLIC_GUILD_MESSAGES', data => {
    //   console.log('[PUBLIC_GUILD_MESSAGES] 事件接收 :', data);
    // });
    console.log('QQ机器人启动成功！');
    ctx.$success('QQ机器人启动成功！');
  }
}

module.exports = HomeController;
