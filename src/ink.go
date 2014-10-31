package main

import (
    "net/http"
    "strings"
    "regexp"
    "os"
    "fmt"
    // "reflect"
)

/* data structure */

type MatchMap map[string]string

type Handle func(ctx *Context)

type Context struct {
    http.ResponseWriter
    Res http.ResponseWriter
    Req *http.Request
    Params MatchMap
    Data map[string]interface {}
    Next func()
}

type Web struct {
    route map[string]Handle
    middleware []Handle
    patternAry [][]string
    patternRegx regexp.Regexp
}

/* private method */

func (web *Web) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    matchMap, pattern := web.match(r.URL.Path)
    ctx := &Context{w, w, r, matchMap, nil, nil}
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
    handle, ok := web.route[r.Method + ":" + pattern]
    if ok {
        handle(ctx)
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
    web.route[method + ":" + pattern] = handle
    web.patternAry = append(web.patternAry, strings.Split(pattern, "/"))
}

/* public api */

func (web *Web) New() {
    web.route = make(map[string]Handle)
    web.middleware = []Handle{}
    web.patternAry = make([][]string, 0)
    patternRegx, _ := regexp.Compile("([^/])*")
    web.patternRegx = *patternRegx
}

func (web *Web) Listen(addr string) {
    http.ListenAndServe(addr, web)
}

func (web *Web) Use(handle Handle) {
    web.middleware = append(web.middleware, handle)
}

func (web *Web) Get(pattern string, handle Handle) {
    web.addHandle("GET", pattern, handle)
}

func (web *Web) Post(pattern string, handle Handle) {
    web.addHandle("POST", pattern, handle)
}

/* test case */

func Cors(ctx *Context) {
    ctx.Header().Set("Access-Control-Allow-Origin", "*")
    ctx.Next()
}

func Static(root string) func(ctx *Context) {
    return func(ctx *Context) {
        fileName := root + ctx.Req.URL.Path
        if f, err := os.Stat(fileName); err == nil && !f.IsDir() {
            http.ServeFile(ctx.Res, ctx.Req, fileName)
        } else {
            ctx.Next()
        }
    }
}

type SessionItem map[string]string

type SessionStore map[string]SessionItem

func (sessionStore *SessionStore) Get(sessionId string) SessionItem {
    value, ok := (*sessionStore)[sessionId]
    if ok {
        return value
    }
    return nil
}

func (sessionStore *SessionStore) Create(sessionId string) (sessionItem SessionItem) {
    sessionItem = make(SessionItem)
    (*sessionStore)[sessionId] = sessionItem
    return
}

func (sessionItem SessionItem) Get(key string) string {
    value, ok := sessionItem[key]
    if ok {
        return value
    }
    return ""
}

func (sessionItem *SessionItem) Set(key string, value string) {
    (*sessionItem)[key] = value
}

func Session() func(ctx *Context) {
    sessionStore := make(SessionStore)
    genSessionId := func() string {
        return "123456"
    }
    createSession := func(ctx *Context) SessionItem {
        sessionId := genSessionId()
        sessionItem := sessionStore.Create(sessionId)
        http.SetCookie(ctx.Res, &http.Cookie {
            Name: "session",
            Value: sessionId,
        })
        return sessionItem
    }
    return func(ctx *Context) {
        ctx.Data = make(map[string]interface {})
        cookie, err := ctx.Req.Cookie("session")
        var sessionItem SessionItem
        if err == nil {
            sessionId := cookie.Value
            sessionItem = sessionStore.Get(sessionId)
            if sessionItem == nil {
                sessionItem = createSession(ctx)
            }
        } else {
            sessionItem = createSession(ctx)
        }
        ctx.Data["session"] = sessionItem
        ctx.Next()
    }
}

func Index(ctx *Context) {
    ctx.Write([]byte("nihao"))
}

func SessionGet(ctx *Context) {
    sessionItem := ctx.Data["session"].(SessionItem)
    value := sessionItem.Get("dev")
    if len(value) == 0 {
        sessionItem.Set("dev", "xxx")
    } else {
        fmt.Println(sessionItem.Get("dev"))
    }
    ctx.Next()
}

func main() {
    web := Web{}
    web.New()
    web.Use(Session())
    web.Use(SessionGet)
    web.Use(Static("public"))
    web.Get("/comment/:id/:s", Index)
    web.Listen("0.0.0.0:9090")
}
