package main

import (
    "strconv"
    "net/http"
    "strings"
    "regexp"
    "fmt"
)

/* data structure */

type Response struct {
    http.ResponseWriter
    parms map[string]string
}

type Request struct {
    http.Request
}

type MatchMap map[string]string

type MiddlewareHandle func(w Response, r *Request, next func())
type Handle func(w Response, r *Request)

type Mux struct {
    route map[string]Handle
    middleware []MiddlewareHandle
    patternAry [][]string
    patternRegx regexp.Regexp
}

type Web struct {
    mux Mux
}

/* method define */

func (mux *Mux)ServeHTTP(w http.ResponseWriter, r *http.Request) {

    // r.URL.Path = "/comment/abc/nihao"

    matchMap, pattern := mux.Match(r.URL.Path)

    res := Response{w, matchMap}
    req := Request{*r}

    for _, preHandle := range mux.middleware {
        keep := false
        preHandle(res, &req, func() {
            keep = true
        })
        if !keep {
            return
        }
    }

    handle, ok := mux.route[r.Method + ":" + pattern]

    if ok {
        handle(res, &req)
    } else {
        http.NotFound(w, r)
    }

}

func (mux *Mux)Match(path string) (matchMap MatchMap, pattern string) {

    pathAry := mux.patternRegx.FindAllString(path, -1)
    matchMap = make(map[string]string)

    for _, patternItem := range mux.patternAry {
        for i, patternKey := range patternItem {
            if i > len(pathAry) - 1 {
                break
            }
            pathKey := pathAry[i]
            if strings.HasPrefix(patternKey, ":") {
                name := strings.TrimPrefix(patternKey, ":")
                matchMap[name] = pathKey
            } else {
                if pathKey != patternKey {
                    break
                }
            }
        }
        pattern = strings.Join(patternItem, "/")
    }

    return
}

func (mux *Mux)Add(pattern string) {
    mux.patternAry = append(mux.patternAry, strings.Split(pattern, "/"))
}

func (web *Web)New() {
    web.mux = Mux{}
    web.mux.route = make(map[string]Handle)
    web.mux.middleware = []MiddlewareHandle{}
    web.mux.patternAry = make([][]string, 0)
    patternRegx, _ := regexp.Compile("([^/])*")
    web.mux.patternRegx = *patternRegx
}

func (web *Web)Listen(addr string, port int) {
    http.ListenAndServe(addr + ":" + strconv.Itoa(port), &web.mux)
}

func (web *Web)Use(handle MiddlewareHandle) {
    web.mux.middleware = append(web.mux.middleware, handle)
}

func (web *Web)AddHandle(method string, pattern string, handle Handle) {
    web.mux.route[method + ":" + pattern] = handle
    web.mux.Add(pattern)
}

func (web *Web)Get(pattern string, handle Handle) {
    web.AddHandle("GET", pattern, handle)
}

func (web *Web)Post(pattern string, handle Handle) {
    web.AddHandle("POST", pattern, handle)
}

/* test case */

func Cors(w Response, r *Request, next func()) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    next()
}

func Abc(w Response, r *Request, next func()) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    next()
}

func Index(w Response, r *Request) {
    fmt.Println(w.parms)
    w.Write([]byte("你好"))
}

func main() {
    web := Web{}
    web.New()
    web.Use(Cors)
    web.Use(Abc)
    web.Get("/comment/:id/:s", Index)
    web.Listen("0.0.0.0", 9090)
}
