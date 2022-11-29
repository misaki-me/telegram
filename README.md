# 一个同步电报频道消息到QQ群的机器人
* QQ基于[oicq][oicq]实现，支持最低node版本为 v14
* 电报基于[GramJS][GramJS]实现

# 部署这个机器人你需要准备什么？
* 一台能访问到外网的电脑或者服务器
* 至少一个月亮的QQ号
* 一个域名（可选）
* 下载ffmpeg软件

## 如果你不想自己搭建也可以私信我，把我的机器人拉进群聊

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7009/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
[oicq]: https://github.com/takayama-lily/oicq
[GramJS]: https://github.com/gram-js/gramjs