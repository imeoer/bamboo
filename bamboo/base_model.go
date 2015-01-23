package bamboo

import (
    "os"
    "fmt"
    "gopkg.in/mgo.v2"
)

type Map map[string]interface{}

var db struct {
    user *mgo.Collection
    article *mgo.Collection
    comment *mgo.Collection
    favarite *mgo.Collection
}

func init() {
    // connect db
    session, err := mgo.Dial("127.0.0.1:27017")
    if err != nil {
        fmt.Println("DB connect failed")
        os.Exit(1)
    }
    session.SetMode(mgo.Monotonic, true)
    database := session.DB("bamboo")
    // get collection
    db.user = database.C("user")
    db.article = database.C("article")
    db.comment = database.C("comment")
    db.favarite = database.C("favarite")
}
