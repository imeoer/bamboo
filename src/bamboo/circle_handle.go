package bamboo

import (
    "ink"
)

var CIRCLES = []string{"电影", "音乐", "二次元", "摄影", "旅行", "产品", "想法", "游戏", "绘画", "程序", "阅读", "设计", "美食", "生活"}

func CircleFocus(ctx *ink.Context) {
    userId := ctx.TokenGet("id").(string)
    circle := getParam(ctx, "circle").(string)
    isFocus := getParam(ctx, "focus").(bool)
    if !isInArray(circle, CIRCLES) {
        returnRet(ctx, false, "指定圈子错误")
        return
    }
    ret := circleFocus(userId, circle, isFocus)
    returnRet(ctx, ret, isFocus)
}
