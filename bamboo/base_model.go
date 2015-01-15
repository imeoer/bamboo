package bamboo

import (
    "time"
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
    session, _ := mgo.DialWithTimeout("mongodb:27017", time.Duration(50 * time.Second))
    session.SetMode(mgo.Monotonic, true)
    database := session.DB("bamboo")
    // get collection
    db.user = database.C("user")
    db.article = database.C("article")
    db.comment = database.C("comment")
    db.favarite = database.C("favarite")
}
