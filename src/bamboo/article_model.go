package bamboo

import (
    // "fmt"
    "gopkg.in/mgo.v2/bson"
)

type Article struct {
    Id bson.ObjectId `bson:"_id"`
    User bson.ObjectId `bson:"_id"`
    Title string
    Content string
}

func articleUpdate(userId string, id string, title string, content string) string {
    var objId bson.ObjectId
    if bson.IsObjectIdHex(id) {
        objId = bson.ObjectIdHex(id)
    } else {
        objId = bson.NewObjectId()
    }
    ret, err := db.article.Upsert(
        bson.M{"_id": objId, "user": userId},
        &Article{objId, bson.ObjectIdHex(userId), title, content},
    )
    if err == nil && ret.Updated > 0 {
        return ret.UpsertedId.(bson.ObjectId).Hex()
    }
    return ""
}

func articleList(userId string) *[]Article {
    ret := make([]Article, 0)
    db.article.Find(bson.M{"user": userId}).Select(bson.M{"_id": 1, "title": 1}).All(&ret)
    return &ret
}

func articleGet(userId string, id string) *Article {
    ret := Article{}
    err := db.article.Find(bson.M{"_id": bson.ObjectIdHex(id), "user": userId}).One(&ret)
    if err == nil {
        return &ret
    }
    return nil
}
