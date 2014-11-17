package bamboo

import (
    "fmt"
    "gopkg.in/mgo.v2/bson"
)

type Article struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Title string `bson:"title" json:"title"`
    Content string `bson:"content" json:"content,omitempty"`
}

func articleUpdate(userId string, id string, title string, content string) string {
    user := bson.ObjectIdHex(userId)
    var err error
    var objId bson.ObjectId
    if bson.IsObjectIdHex(id) {
        objId = bson.ObjectIdHex(id)
        err = db.article.Update(
            bson.M{"_id": objId, "user": user},
            bson.M{
                "$set": bson.M{
                    "title": title,
                    "content": content,
                },
            },
        )
        fmt.Println(objId)
        fmt.Println(userId)
    } else {
        objId = bson.NewObjectId()
        err = db.article.Insert(bson.M{
            "_id": objId,
            "user": user,
            "title": title,
            "content": content,
        })
    }
    if err == nil {
        return objId.Hex()
    }
    return ""
}

func articleList(userId string) *[]Article {
    user := bson.ObjectIdHex(userId)
    ret := make([]Article, 0)
    err := db.article.Find(bson.M{"user": user}).Select(bson.M{"_id": 1, "title": 1}).All(&ret)
    if err == nil {
        return &ret
    }
    fmt.Println(err)
    return nil
}

func articleGet(userId string, id string) *Article {
    user := bson.ObjectIdHex(userId)
    ret := Article{}
    err := db.article.Find(bson.M{"_id": bson.ObjectIdHex(id), "user": user}).One(&ret)
    if err == nil {
        return &ret
    }
    return nil
}
