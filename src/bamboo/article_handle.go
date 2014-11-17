package bamboo

import (
    "ink"
    // "fmt"
    "os"
    "io/ioutil"
    "path/filepath"
)

func ArticleUpdate(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "id").(string)
    articleTitle := getParam(ctx, "title").(string)
    articleContent := getParam(ctx, "content").(string)
    ret := articleUpdate(userId, articleId, articleTitle, articleContent)
    if len(ret) != 0 {
        returnRet(ctx, true, ret)
        return
    }
    returnRet(ctx, false, "文章更新失败，内部错误")
}

func ArticleList(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    ret := articleList(userId)
    if ret != nil {
        returnRet(ctx, true, *ret)
        return
    }
    returnRet(ctx, true, "文章获取失败，内部错误")
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
    file, handler, err := ctx.Req.FormFile("file")
    defer func() {
        if err := recover(); err != nil {
            returnRet(ctx, false, err)
        }
        if file != nil {
            file.Close()
        }
    }()
    if err != nil {
        panic("上传字段格式错误")
    }
    bytes, err := ioutil.ReadAll(file)
    if err != nil {
        panic("数据解析失败")
    }
    ext := filepath.Ext(handler.Filename)
    if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" && ext != ".bmp" {
        panic("上传失败，文件格式不正确")
    }
    fileName := ink.GUID() + ext
    fo, err := os.Create("public/" + fileName)
    if err != nil {
        panic("上传处理失败，内部错误")
    }
    fo.Write(bytes)
    returnRet(ctx, true, fileName)
}
