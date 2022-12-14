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
      port: 7009,//端口
      hostname: '127.0.0.1',
    },
  };
  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET,PUT,POST,DELETE,PATCH',
  };
  // add your user config here
  config.groupIDs = [];//QQ群id集合
  config.QQbot = {//QQ频道bot，用不到可以注释掉
    appID: '', // 申请机器人时获取到的机器人 BotAppID
    token: '', // 申请机器人时获取到的机器人 BotToken
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'INTERACTION', 'MESSAGE_AUDIT', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES'], // 事件订阅,用于开启可接收的消息类型
    sandbox: false, // 沙箱支持，可选，默认false. v2.7.0+
  }
  config.v2Ray = '';//代理配置
  config.guild = {//QQ频道
    id: '',
    channelId: ''
  }
  config.telegram = {//电报机器人参数
    apiId: "",
    apiHash: "",
    token: ""
  }
  config.QQaccount = {//QQ账号
    account: "",
    password: ''
  }
  config.channels = [
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
  config.multipart = {//上传配置
    fileSize: '5mb',
    mode: 'stream',
    fileExtensions: ['.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF', '.jpeg', '.JPEG', '.webp'], // 扩展几种上传的文件格式
  };
  config.sequelize = {//mysql插件，与本项目无关
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
