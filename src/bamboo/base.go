package bamboo

import (
    "gopkg.in/mgo.v2"
)

type MapData map[string]interface{}

var db struct {
    user *mgo.Collection
}

// invoke when import
func init() {
    session, _ := mgo.Dial("127.0.0.1:27017")
    session.SetMode(mgo.Monotonic, true)
    database := session.DB("bamboo")
    db.user = database.C("user")
}
