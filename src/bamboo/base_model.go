package bamboo

import (
    "gopkg.in/mgo.v2"
)

type MapData map[string]interface{}

var db struct {
    user *mgo.Collection
    article  *mgo.Collection
}

func init() {
    // connect db
    session, _ := mgo.Dial("127.0.0.1:27017")
    session.SetMode(mgo.Monotonic, true)
    database := session.DB("bamboo")
    // get collection
    db.user = database.C("user")
    db.article = database.C("article")
}
