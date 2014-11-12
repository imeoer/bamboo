package bamboo

import (
    // "fmt"
    "gopkg.in/mgo.v2/bson"
)

type User struct {
    Id bson.ObjectId `bson:"_id"`
    Mail string
    Pass string
}

// check user if exist
func UserExist(mail string) bool {
    err := db.user.Find(bson.M{"mail": mail}).One(&User{})
    if err == nil {
        return false
    }
    return true
}

// rgister new user
func UserRegister(mail string, pass string) bool {
    err := db.user.Insert(&User{"", mail, pass})
    if err == nil {
        return true
    }
    return false
}

// user login
func UserLogin(mail string, pass string) *User {
    ret := &User{}
    err := db.user.Find(bson.M{"mail": mail, "pass": pass}).One(ret)
    if err == nil {
        return ret
    }
    return nil
}
