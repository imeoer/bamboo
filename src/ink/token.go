package ink

import (
    "time"
)

var tokenMap map[string]typeToken

type typeToken struct {
    time time.Time
    data map[string]interface{}
}

func (ctx *Context) TokenGet(key string) interface{} {
    tokenId := ctx.Req.Header.Get("Token")
    if token, ok := tokenMap[tokenId]; ok {
        if value, ok := token.data[key]; ok {
            return value
        }
    }
    return nil
}

func (ctx *Context) TokenSet(key string, value interface{}) {
    tokenId := ctx.Req.Header.Get("Token")
    if token, ok := tokenMap[tokenId]; ok {
        token.data[key] = value
    }
}

func (ctx *Context) TokenNew() string {
    if len(tokenMap) == 0 {
        tokenMap = make(map[string]typeToken)
    }
    tokenId := GUID()
    token := new(typeToken)
    token.data = make(map[string]interface{})
    tokenMap[tokenId] = *token
    return tokenId
}
