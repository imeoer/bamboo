package main

import (
    "bamboo"
    "encoding/json"
    "ink"
    "fmt"
)

type mapData map[string]interface{}

/* helper method */

func preHandle(ctx *ink.Context) {
    decoder := json.NewDecoder(ctx.Req.Body)
    data := make(mapData)
    err := decoder.Decode(&data)
    if err != nil {
        fmt.Println(err)
    }
    ctx.Ware["data"] = data
    ctx.Header().Set("Content-Type", "application/json;charset=UTF-8")
}

func returnRet(ctx *ink.Context, status bool, result interface{}) {
    data := mapData{
        "status": status,
        "result": result,
    }
    ret, _ := json.Marshal(data)
    ctx.Write(ret)
}

func getParam(ctx *ink.Context, key string) string {
    data := ctx.Ware["data"].(mapData)
    return data[key].(string)
}

/* logic handler */

func login(ctx *ink.Context) {
    mail := getParam(ctx, "mail")
    pass := getParam(ctx, "pass")
    ok := bamboo.UserLogin(mail, pass)
    returnRet(ctx, ok, nil)
}

func register(ctx *ink.Context) {
    mail := getParam(ctx, "mail")
    pass := getParam(ctx, "pass")
    if bamboo.UserExist(mail) {
        returnRet(ctx, false, "exist")
        return
    }
    ok := bamboo.UserRegister(mail, pass)
    if ok {
        returnRet(ctx, true, nil)
        return
    }
    returnRet(ctx, false, "failed")
    return
}

func main() {
    app := ink.App()
    // middleware
    app.Use(ink.Static("public"))
    app.Use(preHandle)
    ink.Token()
    // route handler
    app.Post("/login", login)
    app.Post("/register", register)
    // start server
    app.Listen("0.0.0.0:9090")
}
