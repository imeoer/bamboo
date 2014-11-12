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
    if path != "/user/login" && path != "/user/register" {
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

func getParam(ctx *ink.Context, key string) interface{} {
    data := ctx.Ware["data"].(bamboo.MapData)
    return data[key]
}

/* logic handler */

func login(ctx *ink.Context) {
    mail := getParam(ctx, "mail").(string)
    pass := getParam(ctx, "pass").(string)
    user := bamboo.UserLogin(mail, pass)
    if user != nil {
        token := ctx.TokenNew()
        userId := user.Id
        ctx.TokenSet("id", userId)
        returnRet(ctx, true, token)
        return
    }
    returnRet(ctx, false, "账户或密码错误")
}

func register(ctx *ink.Context) {
    mail := getParam(ctx, "mail").(string)
    pass := getParam(ctx, "pass").(string)
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

// func articleUpdate(ctx *ink.Context) {
//     userId := ctx.TokenGet("id").(int)
//     articleId := int(getParam(ctx, "id").(float64))
//     articleTitle := getParam(ctx, "title").(string)
//     articleContent := getParam(ctx, "content").(string)
//     ret := bamboo.ArticleUpdate(userId, articleId, articleTitle, articleContent)
//     if ret != 0 {
//         returnRet(ctx, true, nil)
//     } else {
//         returnRet(ctx, false, "文章更新失败，内部错误")
//     }
// }
//
// func articleList(ctx *ink.Context) {
//     userId := ctx.TokenGet("id").(int)
//     ret := bamboo.ArticleList(userId)
//     returnRet(ctx, true, ret)
// }

func main() {
    app := ink.App()
    // middleware
    // app.Get("*", ink.Static("public"))
    app.Options("*", ink.Cors)
    app.Post("*", ink.Cors)
    app.Post("*", preHandle)
    // route handler
    app.Post("/user/login", login)
    app.Post("/user/register", register)
    // app.Post("/article/update", articleUpdate)
    // app.Post("/article/list", articleList)
    // start server
    app.Listen("0.0.0.0:9090")
}
