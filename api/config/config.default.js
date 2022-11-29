/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1658740336551_5216';

  // add your middleware config here
  config.middleware = ['auth'];
  config.errorHandler = {
    enable: true,
  };
  config.auth = {
    match: ['/api/upload'],
  };
  // 关闭csrf开启跨域
  config.security = {
    // 关闭csrf
    csrf: {
      // enable: false,
      headerName: 'x-csrf-token',
      ignore: ctx => {
        return ctx.request.url.startsWith('/');
      },
    },
    // 跨域白名单
    domainWhiteList: [''],
  };
  config.static = {
    prefix: '/public/',
    dir: ['app/public'],
    dynamic: true,
    preload: false,
    buffer: true,
  }
  config.cluster = {
    listen: {
      port: 7009,
      hostname: '127.0.0.1',
    },
  };
  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET,PUT,POST,DELETE,PATCH',
  };
  // add your user config here
  config.groupIDs = [
  ];
  config.QQbot = {
    appID: '', // 申请机器人时获取到的机器人 BotAppID
    token: '', // 申请机器人时获取到的机器人 BotToken
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'INTERACTION', 'MESSAGE_AUDIT', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES'], // 事件订阅,用于开启可接收的消息类型
    sandbox: false, // 沙箱支持，可选，默认false. v2.7.0+
  }
  config.v2Ray='';
  config.guild = {
    id: '',
    channelId: ''
  }
  config.telegram = {
    apiId: "",
    apiHash: "",
    token: ""
  }
  config.QQaccount = {
    account: "",
    password: ''
  }
  config.multipart = {
    fileSize: '5mb',
    mode: 'stream',
    fileExtensions: ['.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF', '.jpeg', '.JPEG', '.webp'], // 扩展几种上传的文件格式
  };
  config.sequelize = {
    dialect: 'mysql',
    host: '',
    username: '',
    password: '',
    prot: 3306,
    database: '',
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      underscored: true,
    },
  };
  return {
    ...config,
  };
};
