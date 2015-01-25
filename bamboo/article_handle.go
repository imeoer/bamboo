package bamboo

import (
    "github.com/imeoer/bamboo-api/ink"
    // "fmt"
    // "unicode/utf8"
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
    articleCircles := getParam(ctx, "circles").([]interface{})
    articlePublic := getParam(ctx, "public").(bool)
    for _, circle := range articleCircles {
        if !isInArray(circle.(string), CIRCLES) {
            returnRet(ctx, false, "指定圈子错误")
            return
        }
    }
    ret := articleUpdate(userId, articleId, articleTitle, articleContent, articleCircles, articlePublic)
    if len(ret) != 0 {
        returnRet(ctx, true, ret)
        return
    }
    returnRet(ctx, false, "文章更新失败")
}

func ArticleList(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    filter := getParam(ctx, "filter").(string) // ["private", "public", "favarite"]
    if !isInArray(filter, []string{"private", "public", "favarite"}) {
        returnRet(ctx, false, "指定过滤条件错误")
        return
    }
    ret := articleList(userId, filter)
    if ret != nil {
        // for idx, item := range *ret {
        //     content := []rune(item.Content)
        //     fmt.Println(item.Content)
        //     if len(content) > 140 {
        //         (*ret)[idx].Content = string(content[0:140])
        //     }
        // }
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
    articleId := getParam(ctx, "articleId").(string)
    articleInfo := articleGet("", articleId)
    userId := articleInfo.User.Hex()
    userInfo := userInfo(userId)
    user := (*userInfo)["user"].(User)
    returnRet(ctx, true, Map{
        "article": articleInfo,
        "favarite": false,
        "user": map[string]string{
            "avatar": user.Avatar,
            "nick": user.Nick,
            "motto": user.Motto,
            "name": user.Name,
        },
    })
    articleReadCount(articleId)
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
    fo, err := os.Create("public/images/" + fileName)
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

func ArticleFavarite(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    isFavarite := getParam(ctx, "favarite").(bool)
    ret := articleFavarite(userId, articleId, isFavarite)
    returnRet(ctx, ret, isFavarite)
}
