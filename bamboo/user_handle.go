package bamboo

import (
    "github.com/imeoer/bamboo-api/ink"
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
            "id": userId,
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
    defer exceptHandle(ctx)
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
    defer exceptHandle(ctx)
    userId := ctx.TokenGet("id").(string)
    key := getParam(ctx, "key").(string)
    value := getParam(ctx, "value").(string)
    switch key {
        case "mail":
            if !validType("mail", value) {
                panic("邮箱格式不正确")
            }
            if userExist(value) {
                panic("账户已被使用")
            }
        case "name":
            if !validate("[A-Za-z0-9_]+", value) {
                panic("账户名称只接受字母数字下划线")
            }
        case "nick":
        case "motto":
        case "avatar": // base64 encode
        case "link":
        default:
            panic("要更新的选项不存在")
    }
    if userConfig(userId, key, value) {
        returnRet(ctx, true, nil)
        return
    }
    panic("更新失败，内部错误")
}

func UserInfo(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    ret := userInfo(userId)
    if ret != nil {
        returnRet(ctx, true, ret)
        return
    }
    returnRet(ctx, false, "获取账户信息失败")
}

func UserTimeline(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    ret := userTimeline(userId)
    if ret != nil {
        returnRet(ctx, true, ret)
        return
    }
    returnRet(ctx, false, "获取动态失败")
}