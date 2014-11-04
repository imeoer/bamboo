package main

import (
    "bamboo"
    "ink"
)

func Index(ctx *ink.Context) {
    ctx.Write([]byte("nihao"))
}

func main() {
    bamboo.Register("a", "b")
    ok := bamboo.Login("a", "b")
    print(ok)
    app := ink.App()
    app.Listen("0.0.0.0:9090")
}
