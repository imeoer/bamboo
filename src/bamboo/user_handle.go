package bamboo

import (
    "ink"
)

func UserLogin(ctx *ink.Context) {
    mail := getParam(ctx, "mail").(string)
    pass := getParam(ctx, "pass").(string)
    user := userLogin(mail, pass)
    if user != nil {
        userId := user.Id.Hex()
        token := ctx.TokenNew()
        ctx.TokenSet("id", userId)
        returnRet(ctx, true, map[string]string{
            "token": token,
            "mail": user.Mail,
            "nick": user.Nick,
            "motto": user.Motto,
            "avatar": user.Avatar,
            "link": user.Link,
        })
        return
    }
    returnRet(ctx, false, "账户或密码错误")
}

func UserRegister(ctx *ink.Context) {
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

func UserConfig(ctx *ink.Context) {
    defer func() {
        if err := recover(); err != nil {
            returnRet(ctx, false, err)
        }
    }()
    userId := ctx.TokenGet("id").(string)
    mail := getParam(ctx, "mail").(string)
    nick := getParam(ctx, "nick").(string)
    motto := getParam(ctx, "motto").(string)
    avatar := getParam(ctx, "avatar").(string)
    link := getParam(ctx, "link").(string)
    if userConfig(userId, mail, nick, motto, avatar, link) {
        returnRet(ctx, true, nil)
        return
    }
    panic("更新失败，内部错误")
}
