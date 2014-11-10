package main

import (
    "bamboo"
    "encoding/json"
    "ink"
    "fmt"
    // "io/ioutil"
)

/* helper method */
func preHandle(ctx *ink.Context) {
    // auth check
    path := ctx.Req.URL.Path
    if path != "/login" && path != "/register" {
        userId := ctx.TokenGet("id")
        if userId == nil {
            returnRet(ctx, false, "auth failed")
            ctx.Stop()
            return
        }
    }
    // parse request json data
    decoder := json.NewDecoder(ctx.Req.Body)
    data := make(bamboo.MapData)
    err := decoder.Decode(&data)
    if err != nil {
        fmt.Println(err)
    }
    ctx.Ware["data"] = data
}

func returnRet(ctx *ink.Context, status bool, result interface{}) {
    data := bamboo.MapData{
        "status": status,
        "result": result,
    }
    ret, _ := json.Marshal(data)
    ctx.Write(ret)
}

func getParam(ctx *ink.Context, key string) string {
    data := ctx.Ware["data"].(bamboo.MapData)
    return data[key].(string)
}

/* logic handler */

func login(ctx *ink.Context) {
    mail := getParam(ctx, "mail")
    pass := getParam(ctx, "pass")
    userId := bamboo.UserLogin(mail, pass)
    if userId != 0 {
        token := ctx.TokenNew()
        ctx.TokenSet("id", userId)
        returnRet(ctx, true, token)
        return
    }
    returnRet(ctx, false, "账户或密码错误")
}

func register(ctx *ink.Context) {
    mail := getParam(ctx, "mail")
    pass := getParam(ctx, "pass")
    if bamboo.UserExist(mail) {
        returnRet(ctx, false, "账户已被使用")
        return
    }
    ok := bamboo.UserRegister(mail, pass)
    if ok {
        returnRet(ctx, true, nil)
        return
    }
    returnRet(ctx, false, "注册失败，内部错误")
    return
}

func main() {
    app := ink.App()
    // middleware
    // app.Get("*", ink.Static("public"))
    app.Options("*", ink.Cors)
    app.Post("*", ink.Cors)
    app.Post("*", preHandle)
    // route handler
    app.Post("/test", func (ctx *ink.Context) {
        returnRet(ctx, true, nil)
    })
    app.Post("/login", login)
    app.Post("/register", register)
    // start server
    app.Listen("0.0.0.0:9090")
}
