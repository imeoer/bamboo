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
    mail := getParam(ctx, "mail").(string)
    pass := getParam(ctx, "pass").(string)
    if userExist(mail) {
        returnRet(ctx, false, "账户已被使用")
        return
    }
    ok := userRegister(mail, pass)
    if ok {
        returnRet(ctx, true, nil)
        return
    }
    returnRet(ctx, false, "注册失败，内部错误")
}
