module.exports = {
    $success(data = '', message = '操作成功', code = 200) {
        this.body = { message, data, code }
        this.status = code
    },
    $fail(msg = '操作失败', data = '', code = 201) {
        this.body = { msg, data, code }
        this.status = 200
    },
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}