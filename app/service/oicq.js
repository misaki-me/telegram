'use strict';
const inquirer = require('inquirer')
const Service = require('egg').Service;
const fetch = require('node-fetch')
const lodash = require('lodash')
class OicqService extends Service {
    //滑块验证码
    async slider(event) {
        const { ctx, app } = this;
        console.log(`\n\n------------------${'↓↓滑动验证链接↓↓'}----------------------\n`)
        console.log(event.url)
        console.log('\n--------------------------------------------------------')

        const ret = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: '触发滑动验证，需要获取ticket通过验证，请选择获取方式:',
                choices: ['1.手动获取ticket', '2.滑动验证app请求码获取']
            }
        ])

        await ctx.sleep(200)
        let ticket

        if (ret.type == '2.滑动验证app请求码获取') {
            ticket = await this.requestCode(event.url)
            if (!ticket) console.log('\n请求错误，返回手动获取ticket方式\n')
        }

        if (!ticket) {
            let res = await inquirer.prompt({
                type: 'Input',
                message: '请输入ticket:',
                name: 'ticket',
                validate(value) {
                    if (!value) return 'ticket不能为空'
                    if (value.toLowerCase() == 'ticket') return '请输入获取的ticket'
                    if (value == event.url) return '请勿输入滑动验证链接'
                    return true
                }
            })
            ticket = lodash.trim(res.ticket, '"')
        }
        
        app.client.submitSlider(ticket.trim());
        return false;
    }
    //获取滑动验证助手code
    async requestCode(url) {
        const { ctx } = this;
        let txhelper = {
            url: url.replace('ssl.captcha.qq.com', 'txhelper.glitch.me')
        }
        txhelper.req = await fetch(txhelper.url).catch((err) => console.log(err.toString()))

        if (!txhelper.req?.ok) return false

        txhelper.req = await txhelper.req.text()
        if (!txhelper.req.includes('使用请求码')) return false

        txhelper.code = /\d+/g.exec(txhelper.req)
        if (!txhelper.code) return false

        console.log(`\n请打开滑动验证app，输入请求码${'【' + txhelper.code + '】'}，然后完成滑动验证\n`)

        await ctx.sleep(200)
        await inquirer.prompt({
            type: 'Input',
            message: '验证完成后按回车确认，等待在操作中...',
            name: 'enter'
        })

        txhelper.res = await fetch(txhelper.url).catch((err) => console.log(err.toString()))
        if (!txhelper.res) return false
        txhelper.res = await txhelper.res.text()

        if (!txhelper.res) return false
        if (txhelper.res == txhelper.req) {
            console.log('\n未完成滑动验证')
            return false
        }

        console.log(`\n获取ticket成功：\n${txhelper.res}\n`)
        return lodash.trim(txhelper.res)
    }
    //设备锁
    async device(event) {
        const { ctx, app } = this;
        console.log(event);
        console.log(`\n\n------------------↓↓设备锁验证↓↓----------------------\n`)
        const ret = await inquirer.prompt([{
            type: 'list',
            name: 'type',
            message: '触发设备锁验证，请选择验证方式:',
            choices: ['1.网页扫码验证', '2.发送短信验证码到密保手机']
        }])
        await ctx.sleep(200)
        if (ret.type == '1.网页扫码验证') {
            console.log('\n' + event.url + '\n')
            console.log('请打开上面链接，完成验证后按回车')
            await inquirer.prompt({ type: 'Input', message: '等待操作中...', name: 'enter' })
            await app.client.login()
        } else {
            console.log('\n')
            app.client.sendSmsCode()
            await ctx.sleep(200)
            console.log(`验证码已发送：${event.phone}\n`)
            let res = await inquirer.prompt({ type: 'Input', message: '请输入短信验证码:', name: 'sms' })
            await app.client.submitSmsCode(res.sms)
        }
    }
    //登录错误
    async error(event) {
        const { ctx } = this;
        let string = '';
        if (Number(event.code) === 1) {
            string = 'QQ密码错误，运行命令重新登录：npm run login';
        } else if (event.code == 237) {
            string = `${'ticket'}输入错误或者已失效，已停止运行，请重新登录验证`;
        } else if (event.message.includes('冻结')) {
            string = '账号已被冻结，已停止运行';
        } else if (event.code == 235) {
            string = '[温馨提示]当前应用版本过低，请升级至最新版或联系客服沟通。'
        } else {
            string = '登录错误，已停止运行'
        }
        console.log(string);
        return string;
    }
}

module.exports = OicqService;
