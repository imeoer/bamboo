package bamboo

import (
    "encoding/json"
    "ink"
    "fmt"
)

/* helper method */
func PreHandle(ctx *ink.Context) {
    // auth check
    path := ctx.Req.URL.Path
    if path != "/user/login" && path != "/user/register" {
        userId := ctx.TokenGet("id")
        if userId == nil {
            returnRet(ctx, false, "auth failed")
            ctx.Stop()
            return
        }
    }
    // parse request json data
    decoder := json.NewDecoder(ctx.Req.Body)
    data := make(MapData)
    err := decoder.Decode(&data)
    if err != nil {
        fmt.Println(err)
    }
    ctx.Ware["data"] = data
}

func returnRet(ctx *ink.Context, status bool, result interface{}) {
    data := MapData{
        "status": status,
        "result": result,
    }
    ret, _ := json.Marshal(data)
    ctx.Write(ret)
}

func getParam(ctx *ink.Context, key string) interface{} {
    data := ctx.Ware["data"].(MapData)
    return data[key]
}
