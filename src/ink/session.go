package ink

import (
    "fmt"
    "net/http"
    "crypto/rand"
)

type SessionItem map[string]interface{}

type DefaultSessionStore map[string]SessionItem

type SessionStore interface {
    Create(sessionId string)
    Get(sessionId string) SessionItem
}

var sessionStore SessionStore

func (defaultSessionStore *DefaultSessionStore) Create(sessionId string) {
    (*defaultSessionStore)[sessionId] = make(SessionItem)
}

func (defaultSessionStore *DefaultSessionStore) Get(sessionId string) SessionItem {
    item, ok := (*defaultSessionStore)[sessionId]
    if ok {
        return item
    }
    return nil
}

func (ctx *Context) GetSession(key string) interface{} {
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
    return nil
}

func (ctx *Context) SetSession(key string, value interface{}) {
    cookie, err := ctx.Req.Cookie("session")
    if err == nil {
        sessionId := cookie.Value
        sessionItem := sessionStore.Get(sessionId)
        if sessionItem != nil {
            sessionItem[key] = value
        }
    }
}

func Session(newSessionStore SessionStore) func(ctx *Context) {
    if newSessionStore == nil {
        defaultSessionStore := make(DefaultSessionStore)
        sessionStore = SessionStore(&defaultSessionStore)
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
