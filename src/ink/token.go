package ink

import (
    "fmt"
    "crypto/rand"
)

func Token() func(ctx *Context) {
    // var cookieManage *CookieManage
    cookieManage := new(CookieManage)
    genSessionId := func() string {
        b := make([]byte, 16)
        rand.Read(b)
        return fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
    }
    cookieManage.Get = func(ctx *Context) string {
        fmt.Println(ctx.Req.Header)
        return ctx.Req.Header.Get("Token")
    }
    cookieManage.Set = func(ctx *Context, value string) {
        ctx.Header().Set("Token", genSessionId())
    }
    return Session(nil, cookieManage)
}
