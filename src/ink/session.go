package ink

import (
    "fmt"
    "net/http"
    "crypto/rand"
)

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

/* public method */

func (ctx *Context) SessionGet(key string) interface{} {
    if sessionStore != nil {
        fmt.Println(*sessionStore.(*defaultSessionStore))
        cookie, err := ctx.Req.Cookie("session")
        if err == nil {
            sessionId := cookie.Value
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
    cookie, err := ctx.Req.Cookie("session")
    if err == nil {
        sessionId := cookie.Value
        if sessionStore != nil {
            sessionItem := sessionStore.Get(sessionId)
            if sessionItem != nil {
                sessionItem[key] = value
            }
        }
    }
}

func Session(newSessionStore SessionStore) func(ctx *Context) {
    if newSessionStore == nil {
        store := make(defaultSessionStore)
        sessionStore = SessionStore(&store)
    } else {
        sessionStore = newSessionStore
    }
    genSessionId := func() string {
        b := make([]byte, 16)
        rand.Read(b)
        return fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
    }
    createSession := func(ctx *Context) string {
        sessionId := genSessionId()
        sessionStore.Create(sessionId)
        http.SetCookie(ctx.Res, &http.Cookie {
            Name: "session",
            Value: sessionId,
        })
        return sessionId
    }
    return func(ctx *Context) {
        cookie, err := ctx.Req.Cookie("session")
        if err == nil {
            sessionId := cookie.Value
            sessionItem := sessionStore.Get(sessionId)
            if sessionItem == nil {
                createSession(ctx)
            }
        } else {
            createSession(ctx)
        }
        ctx.Next()
    }
}
