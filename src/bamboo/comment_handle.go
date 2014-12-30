package bamboo

import (
    "ink"
)

func CommentAdd(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    content := getParam(ctx, "content").(string)
    ret := articleCommentAdd(userId, articleId, content)
    returnRet(ctx, ret, nil)
}

func CommentList(ctx *ink.Context) {
    articleId := getParam(ctx, "articleId").(string)
    ret := articleCommentList(articleId)
    if ret == nil {
        returnRet(ctx, false, "评论获取失败")
        return
    }
    returnRet(ctx, true, *ret)
}

func CommentRemove(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    articleId := getParam(ctx, "articleId").(string)
    commentId := getParam(ctx, "commentId").(string)
    ret := articleCommentRemove(userId, articleId, commentId)
    returnRet(ctx, ret, nil)
}
