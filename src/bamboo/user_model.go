package bamboo

import (
    // "fmt"
    "gopkg.in/mgo.v2/bson"
)

type User struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    Mail string `bson:"mail" json:"mail"`
    Pass string `bson:"pass" json:"pass"`
    Nick string `bson:"nick" json:"nick"`
    Motto string `bson:"motto" json:"motto"`
    Avatar string `bson:"avatar" json:"avatar"`
    Link string `bson:"link" json:"link"`
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
func userConfig(userId string, key string, value string) bool {
    user := bson.ObjectIdHex(userId)
    err := db.user.Update(
        bson.M{"_id": user},
        bson.M{
            "$set": bson.M{
                key: value,
            },
        },
    )
    if err == nil {
        return true
    }
    return false
}

// user info
func userInfo(userId string) *User {
    user := bson.ObjectIdHex(userId)
    ret := &User{}
    err := db.user.FindId(user).One(ret)
    if err == nil {
        return ret
    }
    return nil
}

// get user's favarite article list
func userFavariteArticleList(userId string) *[]Article {
    user := bson.ObjectIdHex(userId)
    ret := make([]Article, 0)
    err := db.article.Find(bson.M{"user": user}).Select(bson.M{"_id": 1, "title": 1, "content": 1}).Sort("-$natural").All(&ret)
    if err == nil {
        return &ret
    }
    return nil
}

// if article is favarite
func userArticleIsFavarite(userId string, articleId string) *Favarite {
    user := bson.ObjectIdHex(userId)
    article := bson.ObjectIdHex(articleId)
    ret := &Favarite{}
    err := db.article.Find(bson.M{"user": user, "article": article}).One(ret)
    if err == nil {
        return ret
    }
    return nil
}
