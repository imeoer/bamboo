package bamboo

import (
    // "fmt"
    "gopkg.in/mgo.v2/bson"
)

type User struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    Name string `bson:"name" json:"name"`
    Mail string `bson:"mail" json:"mail"`
    Pass string `bson:"pass" json:"pass"`
    Nick string `bson:"nick" json:"nick"`
    Motto string `bson:"motto" json:"motto"`
    Avatar string `bson:"avatar" json:"avatar"`
    Link string `bson:"link" json:"link"`
    Circle []string `bson:"circle" json:"circle"`
}

// check user if exist
func userExist(mail string) bool {
    count, err := db.user.Find(bson.M{"mail": mail}).Count()
    if err != nil || count != 0 {
        return true
    }
    return false
}

// rgister new user
func userRegister(mail string, pass string) bool {
    objId := bson.NewObjectId()
    err := db.user.Insert(&User{objId, "", mail, pass, "", "", "", "", []string{}})
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
func userInfo(userId string) *Map {
    user := bson.ObjectIdHex(userId)
    // get user info
    userInfo := &User{}
    err := db.user.FindId(user).One(userInfo)
    if err != nil {
        return nil
    }
    // get article count
    articleCount, err := db.article.Find(bson.M{"user": user}).Count()
    if err != nil {
        return nil
    }
    // get favarite count
    favariteCount, err := db.favarite.Find(bson.M{"user": user}).Count()
    if err != nil {
        return nil
    }
    return &Map{
        "user": *userInfo,
        "article": articleCount,
        "favarite": favariteCount,
    }
}

// if article is favarite
func userArticleIsFavarite(userId string, articleId string) bool {
    user := bson.ObjectIdHex(userId)
    article := bson.ObjectIdHex(articleId)
    count, err := db.favarite.Find(bson.M{"user": user, "article": article}).Count()
    if err != nil || count == 0 {
        return false
    }
    return true
}

func userTimeline(userId string) *[]Map {
    var err error
    user := bson.ObjectIdHex(userId)
    articles := make([]Article, 0)
    currentUser := &User{}
    db.user.FindId(user).One(currentUser)
    err = db.article.Find(bson.M{"public": true, "circle": bson.M{"$in": currentUser.Circle}}).All(&articles)
    if err == nil {
        ret := make([]Map, 0)
        for _, article := range articles {
            user := userInfo(article.User.Hex())
            ret = append(ret, Map{
                "user": (*user)["user"],
                "article": article,
            })
        }
        return &ret
    }
    return nil
}

func userPage(userName string) *Map {
    userInfo := &User{}
    db.user.Find(bson.M{"name": userName}).One(userInfo)
    userId := userInfo.Id.Hex()
    if userId != "" {
        articles := articleList(userId, "public")
        if articles != nil {
            return &Map{
                "user": *userInfo,
                "articles": *articles,
            }
        }
    }
    return nil
}
