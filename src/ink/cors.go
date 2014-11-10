package ink

func Cors(ctx *Context) {
    ctx.Header().Set("Access-Control-Allow-Origin", "*")
    ctx.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    ctx.Header().Set("Access-Control-Allow-Headers", "Token")
    if ctx.Req.Method == "OPTIONS" {
        ctx.Write([]byte{})
        ctx.Stop()
    }
}
