package ink

import (
    "net/http"
    "strings"
    "regexp"
    "fmt"
    "crypto/rand"
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

func GUID() string {
    b := make([]byte, 16)
    rand.Read(b)
    return fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

/* private method */

func (web *Web) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    matchMap, pattern := web.match(r.URL.Path)
    ctx := &Context{w, w, r, matchMap, make(map[string]interface{}), nil}
    fmt.Println(r.Method + ":" + pattern)
    allHandle := make([]Handle, 0)
    handleAry1, ok1 := web.route[r.Method + ":*"]
    if ok1 {
        allHandle = append(allHandle, handleAry1...)
    }
    handleAry2, ok2 := web.route[r.Method + ":" + pattern]
    if ok2 {
        allHandle = append(allHandle, handleAry2...)
    }
    if len(allHandle) != 0 {
        for _, handle := range allHandle {
            keep := true
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
    if _, ok := web.route[path]; !ok {
        web.route[path] = make([]Handle, 0)
    }
    web.route[path] = append(web.route[path], handle)
    web.patternAry = append(web.patternAry, strings.Split(pattern, "/"))
    fmt.Println(web.route)
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
