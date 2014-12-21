package bamboo

import (
    // "fmt"
    "gopkg.in/mgo.v2/bson"
)

type User struct {
    Id bson.ObjectId `bson:"_id"`
    Mail string
    Pass string
    Nick string
    Motto string
    Avatar string
    Link string
}

// check user if exist
func userExist(mail string) bool {
    err := db.user.Find(bson.M{"mail": mail}).One(&User{})
    if err == nil {
        return false
    }
    return true
}

// rgister new user
func userRegister(mail string, pass string) bool {
    err := db.user.Insert(&User{"", mail, pass, "", "", "", ""})
    if err == nil {
        return true
    }
    return false
}

// user login
func userLogin(mail string, pass string) *User {
    ret := &User{}
    err := db.user.Find(bson.M{"mail": mail, "pass": pass}).One(ret)
    if err == nil {
        return ret
    }
    return nil
}

// user config
func userConfig(userId string, mail string, nick string, motto string, avatar string, link string) bool {
    user := bson.ObjectIdHex(userId)
    err := db.user.Update(
        bson.M{"_id": user},
        bson.M{
            "$set": bson.M{
                "mail": mail,
                "nick": nick,
                "motto": motto,
                "avatar": avatar,
                "link": link,
            },
        },
    )
    if err == nil {
        return true
    }
    return false
}
