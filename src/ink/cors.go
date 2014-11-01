package ink

func Cors(ctx *Context) {
    ctx.Header().Set("Access-Control-Allow-Origin", "*")
    ctx.Next()
}
