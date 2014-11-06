package ink

import (
    "net/http"
    "strings"
    "regexp"
)

/* data structure */

type MatchMap map[string]string

type Handle func(ctx *Context)

type Context struct {
    http.ResponseWriter
    Res http.ResponseWriter
    Req *http.Request
    Param MatchMap
    Ware map[string]interface{}
    Stop func()
}

type Web struct {
    route map[string][]Handle
    patternAry [][]string
    patternRegx regexp.Regexp
}

/* private method */

func (web *Web) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    matchMap, pattern := web.match(r.URL.Path)
    ctx := &Context{w, w, r, matchMap, make(map[string]interface{}), nil}
    // handle * route
    handleAry, ok := web.route[r.Method + ":" + pattern]
    if ok {
        for _, handle := range handleAry {
            keep := false
            ctx.Stop = func() {
                keep = false
            }
            handle(ctx)
            if !keep {
                return
            }
        }
    } else {
        http.NotFound(w, r)
    }
}

func (web *Web) match(path string) (matchMap MatchMap, pattern string) {
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

func (web *Web) addHandle(method string, pattern string, handle Handle) {
    path := method + ":" + pattern
    _, ok := web.route[path]
    if !ok {
        web.route[path] = make([]Handle, 0)
    }
    web.route[path] = append(web.route[path], handle)
    web.patternAry = append(web.patternAry, strings.Split(pattern, "/"))
}

/* public api */

func (web *Web) Get(pattern string, handle Handle) {
    web.addHandle("GET", pattern, handle)
}

func (web *Web) Post(pattern string, handle Handle) {
    web.addHandle("POST", pattern, handle)
}

func (web *Web) Listen(addr string) {
    http.ListenAndServe(addr, web)
}

func App() (web Web) {
    web = Web{}
    web.route = make(map[string][]Handle)
    web.patternAry = make([][]string, 0)
    patternRegx, _ := regexp.Compile("([^/])*")
    web.patternRegx = *patternRegx
    return
}
