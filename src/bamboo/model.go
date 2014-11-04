package bamboo

import (
    "encoding/json"
    "github.com/HouzuoGuo/tiedot/db"
)

type mapData map[string]interface{}

var inkdb *db.DB
var user *db.Col

func init() {
    inkdb, _ = db.OpenDB("DB")

    inkdb.Create("user")
    user = inkdb.Use("user")
    user.Index([]string{"mail"})
    user.Index([]string{"pass"})
}

func query(col *db.Col, qstr string) (ret map[int]struct{}) {
    var cond interface{}
    json.Unmarshal([]byte(qstr), &cond)
    ret = make(map[int]struct{})
    db.EvalQuery(cond, user, &ret)
    return ret
}

func Register(mail string, pass string) {
    user.Insert(mapData{
        "mail": mail,
        "pass": pass,
    })
}

func Login(mail string, pass string) bool {
    ret := query(user, `{"n": [
        {"eq": "` + mail + `", "in": ["mail"]},
        {"eq": "` + pass + `", "in": ["pass"]}
    ]}`)
    if len(ret) == 0 {
        return false
    }
    return true
}
