package ink

import (
    "fmt"
    "net/http"
    "crypto/rand"
)

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
        b := make([]byte, 16)
        rand.Read(b)
        return fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
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
