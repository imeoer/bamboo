package main

import (
    "ink"
    "bamboo"
    // "fmt"
)

func main() {
    app := ink.New()
    // middleware
    app.Options("*", ink.Cors)
    app.Get("*", ink.Static("public"))
    app.Post("*", ink.Cors)
    app.Post("*", bamboo.PreHandle)
    // user
    app.Post("/user/login", bamboo.Login)
    app.Post("/user/register", bamboo.Register)
    // article
    app.Post("/article/update", bamboo.ArticleUpdate)
    app.Post("/article/list", bamboo.ArticleList)
    app.Post("/article/remove", bamboo.ArticleRemove)
    app.Post("/article/get", bamboo.ArticleGet)
    app.Post("/article/upload", bamboo.ArticleUpload)
    // start server
    app.Listen("0.0.0.0:9090")
}
