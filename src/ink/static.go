package ink

import (
    "os"
    "net/http"
)

func Static(root string) func(ctx *Context) {
    return func(ctx *Context) {
        if ctx.Req.URL.Path == "" || ctx.Req.URL.Path == "/" {
            http.ServeFile(ctx.Res, ctx.Req, root + "/index.html")
        } else {
            fileName := root + ctx.Req.URL.Path
            if f, err := os.Stat(fileName); err == nil && !f.IsDir() {
                http.ServeFile(ctx.Res, ctx.Req, fileName)
                ctx.Stop()
            }
        }
    }
}
