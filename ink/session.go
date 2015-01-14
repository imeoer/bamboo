package ink

import (
    "fmt"
    "net/http"
)

// session store interface

var sessionStore SessionStore

type SessionStore interface {
    Create(sessionId string)
    Get(sessionId string) map[string]interface{}
}

type defaultSessionStore map[string]map[string]interface{}

func (store *defaultSessionStore) Create(sessionId string) {
    (*store)[sessionId] = make(map[string]interface{})
}

func (store *defaultSessionStore) Get(sessionId string) map[string]interface{} {
    item, ok := (*store)[sessionId]
    if ok {
        return item
    }
    return nil
}

// cookie manage interface
var cookieManage *CookieManage

type CookieManage struct {
    Set func(ctx *Context, value string)
    Get func(ctx *Context) string
}

// default session name
const sessionName = "session"

/* public method */

func (ctx *Context) SessionGet(key string) interface{} {
    if sessionStore != nil {
        sessionId := cookieManage.Get(ctx)
        if len(sessionId) != 0 {
            sessionItem := sessionStore.Get(sessionId)
            if sessionItem != nil {
                value, ok := sessionItem[key]
                if ok {
                    return value
                }
            }
        }
    }
    return nil
}

func (ctx *Context) SessionSet(key string, value interface{}) {
    sessionId := cookieManage.Get(ctx)
    if len(sessionId) != 0 {
        if sessionStore != nil {
            sessionItem := sessionStore.Get(sessionId)
            if sessionItem != nil {
                sessionItem[key] = value
            }
        }
    }
}

func Session(store SessionStore, cm *CookieManage) func(ctx *Context) {
    if store == nil {
        newStore := make(defaultSessionStore)
        sessionStore = SessionStore(&newStore)
    } else {
        sessionStore = store
    }
    if cm == nil {
        cookieManage = new(CookieManage)
        cookieManage.Get = func(ctx *Context) string {
            cookie, err := ctx.Req.Cookie(sessionName)
            if err != nil {
                return ""
            }
            return cookie.Value
        }
        cookieManage.Set = func(ctx *Context, value string) {
            http.SetCookie(ctx.Res, &http.Cookie {
                Name: sessionName,
                Value: value,
            })
        }
    } else {
        cookieManage = cm
    }
    createSession := func(ctx *Context) string {
        sessionId := GUID()
        sessionStore.Create(sessionId)
        cookieManage.Set(ctx, sessionId)
        return sessionId
    }
    return func(ctx *Context) {
        sessionId := cookieManage.Get(ctx)
        if len(sessionId) != 0 {
            fmt.Println("HAVE TOKEN")
            sessionItem := sessionStore.Get(sessionId)
            if sessionItem == nil {
                createSession(ctx)
            }
        } else {
            fmt.Println("NO TOKEN")
            createSession(ctx)
        }
    }
}
