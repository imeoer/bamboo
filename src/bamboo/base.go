package bamboo

import (
    "encoding/json"
    "github.com/HouzuoGuo/tiedot/db"
)

type MapData map[string]interface{}

var inkdb *db.DB

var user *db.Col
var article *db.Col

// invoke when import
func init() {
    // init database
    inkdb, _ = db.OpenDB("DB")
    // init collection
    user = initCol("user", []string{"mail", "pass"})
    article = initCol("article", []string{"user", "title", "content"})
}

// create collection and field index
func initCol(name string, fields []string) (col *db.Col) {
    inkdb.Create(name)
    col = inkdb.Use(name)
    col.Index(fields)
    return
}

// database query method
func query(col *db.Col, qstr string) (ret map[int]struct{}) {
    var cond interface{}
    json.Unmarshal([]byte(qstr), &cond)
    ret = make(map[int]struct{})
    db.EvalQuery(cond, user, &ret)
    return ret
}

// database insert method
func insert(col *db.Col, data MapData) int {
    count, _ := col.Insert(data)
    return count
}
