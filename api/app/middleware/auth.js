module.exports = (option, app) => {
    return async (ctx, next) => {
        const token = ctx.header.token || ctx.query.token;
        if (!token) return ctx.throw(401, '需要登录后才能访问该接口');
        if (token != "misaki") return ctx.throw(401, 'Token 令牌不合法!');
        // 挂载用户信息在ctx
        await next();
    };
};
