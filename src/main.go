package main

import (
    "ink"
    "bamboo"
)

func main() {
    app := ink.App()
    // middleware
    // app.Get("*", ink.Static("public"))
    app.Options("*", ink.Cors)
    app.Post("*", ink.Cors)
    app.Post("*", bamboo.PreHandle)
    // route handler
    app.Post("/user/login", bamboo.Login)
    app.Post("/user/register", bamboo.Register)
    app.Post("/article/update", bamboo.ArticleUpdate)
    app.Post("/article/list", bamboo.ArticleList)
    app.Post("/article/upload", bamboo.ArticleUpload)
    // start server
    app.Listen("0.0.0.0:9090")
}
