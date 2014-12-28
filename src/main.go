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
    app.Get("*", ink.Static("/home/imeoer/PROJECT/ink.go/public"))
    app.Post("*", ink.Cors)
    app.Post("*", bamboo.PreHandle)
    // user
    app.Post("/user/login", bamboo.UserLogin)
    app.Post("/user/register", bamboo.UserRegister)
    app.Post("/user/config", bamboo.UserConfig)
    app.Post("/user/favarite", bamboo.UserFavariteArticleList)
    // article
    app.Post("/article/update", bamboo.ArticleUpdate)
    app.Post("/article/list", bamboo.ArticleList)
    app.Post("/article/remove", bamboo.ArticleRemove)
    app.Post("/article/get", bamboo.ArticleGet)
    app.Post("/article/upload", bamboo.ArticleUpload)
    app.Post("/article/like", bamboo.ArticleLike)
    app.Post("/article/favarite", bamboo.ArticleFavarite)
    // comment
    app.Post("/comment/add", bamboo.ArticleCommentAdd)
    app.Post("/comment/list", bamboo.ArticleCommentList)
    app.Post("/comment/remove", bamboo.ArticleCommentRemove)
    // start server
    app.Listen("0.0.0.0:9090")
}
