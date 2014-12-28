package bamboo

import (
    "ink"
    // "fmt"
    "os"
    "io/ioutil"
    "strings"
    "path/filepath"
)

func ArticleUpdate(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    articleTitle := getParam(ctx, "title").(string)
    articleContent := getParam(ctx, "content").(string)
    ret := articleUpdate(userId, articleId, articleTitle, articleContent)
    if len(ret) != 0 {
        returnRet(ctx, true, ret)
        return
    }
    returnRet(ctx, false, "文章更新失败")
}

func ArticleList(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    ret := articleList(userId)
    if ret != nil {
        returnRet(ctx, true, *ret)
        return
    }
    returnRet(ctx, true, "文章获取失败")
}

func ArticleRemove(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    ret := articleRemove(userId, articleId)
    if ret {
        returnRet(ctx, true, nil)
        return
    }
    returnRet(ctx, false, "文章删除失败")
}

func ArticleGet(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    articleInfo := articleGet(userId, articleId)
    userInfo := userInfo(userId)
    favariteInfo := userArticleIsFavarite(userId, articleId)
    isFavarite := false
    if favariteInfo != nil {
        isFavarite = true
    }
    if articleInfo == nil || userInfo == nil {
        returnRet(ctx, false, "文章获取失败")
        return
    }
    returnRet(ctx, true, Map{
        "article": articleInfo,
        "user": userInfo,
        "favarite": isFavarite,
    })
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
    ext := strings.ToLower(filepath.Ext(handler.Filename))
    if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" && ext != ".bmp" {
        panic("上传文件格式不正确")
    }
    fileName := ink.GUID() + ext
    fo, err := os.Create("/home/imeoer/PROJECT/ink.go/public/" + fileName)
    if err != nil {
        panic("上传处理失败")
    }
    fo.Write(bytes)
    returnRet(ctx, true, fileName)
}

func ArticleLike(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    isLike := getParam(ctx, "like").(bool)
    ret := articleLike(userId, articleId, isLike)
    returnRet(ctx, ret, isLike)
}

func ArticleCommentAdd(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    content := getParam(ctx, "content").(string)
    ret := articleCommentAdd(userId, articleId, content)
    returnRet(ctx, ret, nil)
}

func ArticleCommentList(ctx *ink.Context) {
    articleId := getParam(ctx, "articleId").(string)
    ret := articleCommentList(articleId)
    if ret == nil {
        returnRet(ctx, false, "评论获取失败")
        return
    }
    returnRet(ctx, true, *ret)
}

func ArticleCommentRemove(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    commentId := getParam(ctx, "commentId").(string)
    ret := articleCommentRemove(userId, articleId, commentId)
    returnRet(ctx, ret, nil)
}

func ArticleFavarite(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    isFavarite := getParam(ctx, "favarite").(bool)
    ret := articleLike(userId, articleId, isFavarite)
    returnRet(ctx, ret, isFavarite)
}
