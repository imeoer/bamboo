package main

import (
    "strconv"
    "net/http"
)

/* data structure */

type Handle func(w http.ResponseWriter, r *http.Request)

type Mux struct {
    route map[string]Handle
    middleware []Handle
}

type Web struct {
    mux Mux
}

/* method define */

func (mux *Mux)ServeHTTP(w http.ResponseWriter, r *http.Request) {
    for _, preHandle := range mux.middleware {
        preHandle(w, r)
    }
    handle, ok := mux.route[r.Method + ":" + r.URL.Path]
    if ok {
        handle(w, r)
    } else {
        http.NotFound(w, r)
    }
}

func (web *Web)New() {
    web.mux = Mux{}
    web.mux.route = make(map[string]Handle)
    web.mux.middleware = []Handle{}
}

func (web *Web)Listen(addr string, port int) {
    http.ListenAndServe(addr + ":" + strconv.Itoa(port), &web.mux)
}

func (web *Web)Use(handle Handle) {
    web.mux.middleware = append(web.mux.middleware, handle)
}

func (web *Web)Get(path string, handle Handle) {
    web.mux.route["GET:" + path] = handle
}

func (web *Web)Post(path string, handle Handle) {
    web.mux.route["POST:" + path] = handle
}

func (web *Web)Put(path string, handle Handle) {
    web.mux.route["PUT:" + path] = handle
}

func (web *Web)Delete(path string, handle Handle) {
    web.mux.route["DELETE:" + path] = handle
}

/* test case */

func Cors(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
}

func Index(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("ok"))
}

func main() {
    web := Web{}
    web.New()
    web.Use(Cors)
    web.Get("/", Index)
    web.Listen("0.0.0.0", 9090)
}
