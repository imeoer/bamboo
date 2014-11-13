package bamboo

import (
    "ink"
    "fmt"
    "io/ioutil"
)

func ArticleUpdate(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "id").(string)
    articleTitle := getParam(ctx, "title").(string)
    articleContent := getParam(ctx, "content").(string)
    ret := articleUpdate(userId, articleId, articleTitle, articleContent)
    if len(ret) != 0 {
        returnRet(ctx, true, ret)
    } else {
        returnRet(ctx, false, "文章更新失败，内部错误")
    }
}

func ArticleList(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    ret := articleList(userId)
    returnRet(ctx, true, *ret)
}

func ArticleGet(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "id").(string)
    ret := articleGet(userId, articleId)
    if ret != nil {
        returnRet(ctx, false, "文章获取失败，内部错误")
        return
    }
    returnRet(ctx, true, *ret)
}

func ArticleUpload(ctx *ink.Context) {
    file, _, err := ctx.Req.FormFile("file")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer func() {
        if err := file.Close(); err != nil {
            fmt.Println(err)
            return
        }
    }()
    bytes, err := ioutil.ReadAll(file)
    if err != nil {
        fmt.Println(err)
        return
    }
    ctx.Write(bytes)
}
