package bamboo

import (
    // "fmt"
    "time"
    "gopkg.in/mgo.v2/bson"
)

type Favarite struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Article bson.ObjectId `bson:"article" json:"article,omitempty"`
    Date time.Time `bson:"date" json:"date,omitempty"`
}

type Comment struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Content string `bson:"content" json:"content,omitempty"`
    Created time.Time `bson:"created" json:"created,omitempty"`
}

type Article struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Title string `bson:"title" json:"title"`
    Content string `bson:"content" json:"content,omitempty"`
    Created time.Time `bson:"created" json:"created,omitempty"`
    Updated time.Time `bson:"updated" json:"updated,omitempty"`
    Like []bson.ObjectId `bson:"like" json:"like,omitempty"`
    Comment []Comment `bson:"comment" json:"comment,omitempty"`
}

func articleUpdate(userId string, articleId string, title string, content string) string {
    user := bson.ObjectIdHex(userId)
    var err error
    var objId bson.ObjectId
    if bson.IsObjectIdHex(articleId) {
        objId = bson.ObjectIdHex(articleId)
        err = db.article.Update(
            bson.M{"_id": objId, "user": user},
            bson.M{
                "$set": bson.M{
                    "title": title,
                    "content": content,
                    "updated": time.Now(),
                },
            },
        )
    } else {
        objId = bson.NewObjectId()
        now := time.Now()
        err = db.article.Insert(bson.M{
            "_id": objId,
            "user": user,
            "title": title,
            "content": content,
            "created": now,
            "updated": now,
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
    err := db.article.Find(bson.M{"user": user}).Select(bson.M{"_id": 1, "title": 1, "content": 1}).Sort("-$natural").All(&ret)
    if err == nil {
        return &ret
    }
    return nil
}

func articleRemove(userId string, articleId string) bool {
    user := bson.ObjectIdHex(userId)
    err := db.article.Remove(bson.M{"_id": bson.ObjectIdHex(articleId), "user": user})
    if err == nil {
        return true
    }
    return false
}

func articleGet(userId string, articleId string) *Article {
    user := bson.ObjectIdHex(userId)
    ret := Article{}
    err := db.article.Find(bson.M{"_id": bson.ObjectIdHex(articleId), "user": user}).One(&ret)
    if err == nil {
        return &ret
    }
    return nil
}

func articleLike(userId string, articleId string, isLike bool) bool {
    user := bson.ObjectIdHex(userId)
    var err error
    operate := "$addToSet"
    if !isLike {
        operate = "$pull"
    }
    err = db.article.Update(
        bson.M{"_id": bson.ObjectIdHex(articleId), "user": user},
        bson.M{
            operate: bson.M{
                "like": user,
            },
        },
    )
    if err == nil {
        return true
    }
    return false
}

func articleCommentAdd(userId string, articleId string, content string) bool {
    err := db.comment.Insert(bson.M{
        "_id": bson.NewObjectId(),
        "article": bson.ObjectIdHex(articleId),
        "user": bson.ObjectIdHex(userId),
        "content": content,
        "created": time.Now(),
    })
    if err == nil {
        return true
    }
    return false
}

func articleCommentList(articleId string) *[]Comment {
    ret := make([]Comment, 0)
    err := db.comment.Find(bson.M{"article": bson.ObjectIdHex(articleId)}).All(&ret)
    if err == nil {
        return &ret
    }
    return nil
}

func articleCommentRemove(userId string, articleId string, commentId string) bool {
    var err error
    ret := Article{}
    err = db.article.Find(bson.M{"_id": bson.ObjectIdHex(articleId), "user": bson.ObjectIdHex(userId)}).
    Select(bson.M{"_id": 1}).One(&ret)
    if err == nil && &ret == nil {
        err = db.comment.Remove(bson.M{"_id": bson.ObjectIdHex(commentId)})
        if err == nil {
            return true
        }
    }
    return false
}

func articleFavarite(userId string, articleId string, isFavarite bool) bool {
    user := bson.ObjectIdHex(userId)
    article := bson.ObjectIdHex(articleId)
    var err error
    if isFavarite {
        err = db.favarite.Insert(bson.M{
            "_id": bson.NewObjectId(),
            "user": user,
            "article": article,
            "date": time.Now(),
        })
    } else {
        err = db.favarite.Remove(bson.M{
            "user": user,
            "article": article,
        })
    }
    if err == nil {
        return true
    }
    return false
}
