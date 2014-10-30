package main

import (
    "net/http"
    "strings"
    "regexp"
    "os"
    "fmt"
)

/* data structure */

type MatchMap map[string]string

type Handle func(ctx Context)

type Context struct {
    http.ResponseWriter
    Res http.ResponseWriter
    Req *http.Request
    Params MatchMap
    Next func()
}

type Web struct {
    route map[string]Handle
    middleware []Handle
    patternAry [][]string
    patternRegx regexp.Regexp
}

/* private method */

func (web *Web)ServeHTTP(w http.ResponseWriter, r *http.Request) {

    matchMap, pattern := web.match(r.URL.Path)

    ctx := Context{w, w, r, matchMap, nil}

    for _, preHandle := range web.middleware {
        keep := false
        ctx.Next = func() {
            keep = true
        }
        preHandle(ctx)
        if !keep {
            return
        }
    }

    fmt.Println(pattern)

    handle, ok := web.route[r.Method + ":" + pattern]

    if ok {
        handle(ctx)
    } else {
        http.NotFound(w, r)
    }

}

func (web *Web)match(path string) (matchMap MatchMap, pattern string) {

    pathAry := web.patternRegx.FindAllString(path, -1)
    matchMap = make(map[string]string)

    for _, patternItem := range web.patternAry {
        for j, patternKey := range patternItem {
            if j > len(pathAry) - 1 {
                break
            }
            pathKey := pathAry[j]
            if strings.HasPrefix(patternKey, ":") {
                name := strings.TrimPrefix(patternKey, ":")
                matchMap[name] = pathKey
            } else {
                if pathKey != patternKey {
                    break
                }
            }
            // match success
            if j == len(patternItem) - 1 {
                pattern = strings.Join(patternItem, "/")
                return
            }
        }
    }

    return
}

func (web *Web)add(pattern string) {
    web.patternAry = append(web.patternAry, strings.Split(pattern, "/"))
}

func (web *Web)addHandle(method string, pattern string, handle Handle) {
    web.route[method + ":" + pattern] = handle
    web.add(pattern)
}

/* public api */

func (web *Web)New() {
    web.route = make(map[string]Handle)
    web.middleware = []Handle{}
    web.patternAry = make([][]string, 0)
    patternRegx, _ := regexp.Compile("([^/])*")
    web.patternRegx = *patternRegx
}

func (web *Web)Listen(addr string) {
    http.ListenAndServe(addr, web)
}

func (web *Web)Use(handle Handle) {
    web.middleware = append(web.middleware, handle)
}

func (web *Web)Get(pattern string, handle Handle) {
    web.addHandle("GET", pattern, handle)
}

func (web *Web)Post(pattern string, handle Handle) {
    web.addHandle("POST", pattern, handle)
}

/* test case */

func Cors(ctx Context) {
    ctx.Header().Set("Access-Control-Allow-Origin", "*")
    ctx.Next()
}

func Static(root string) func(ctx Context) {
    return func(ctx Context) {
        fileName := root + ctx.Req.URL.Path
        if f, err := os.Stat(fileName); err == nil && !f.IsDir() {
            http.ServeFile(ctx.Res, ctx.Req, fileName)
        } else {
            ctx.Next()
        }
    }
}

func Index(ctx Context) {
    ctx.Write([]byte("nihao"))
}

func main() {
    web := Web{}
    web.New()
    web.Use(Cors)
    web.Use(Static("public"))
    web.Get("/comment/:id/:s", Index)
    web.Listen("0.0.0.0:9090")
}
