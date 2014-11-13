package bamboo

import (
    "ink"
)

func Login(ctx *ink.Context) {
    mail := getParam(ctx, "mail").(string)
    pass := getParam(ctx, "pass").(string)
    userId := userLogin(mail, pass)
    if len(userId) != 0 {
        token := ctx.TokenNew()
        ctx.TokenSet("id", userId)
        returnRet(ctx, true, token)
        return
    }
    returnRet(ctx, false, "账户或密码错误")
}

func Register(ctx *ink.Context) {
    defer func() {
        if err := recover(); err != nil {
            returnRet(ctx, false, err)
        }
    }()
    mail := getParam(ctx, "mail").(string)
    pass := getParam(ctx, "pass").(string)
    if !validType("mail", mail) {
        panic("邮箱格式不正确")
    }
    if passLen := len(pass); passLen < 6 || passLen > 16 {
        panic("密码位数在6-16之间")
    }
    if userExist(mail) {
        panic("账户已被使用")
    }
    if userRegister(mail, pass) {
        returnRet(ctx, true, nil)
        return
    }
    panic("注册失败，内部错误")
}
