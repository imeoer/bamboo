package bamboo

import (
    "time"
    "gopkg.in/mgo.v2/bson"
)

type Comment struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Content string `bson:"content" json:"content,omitempty"`
    Created time.Time `bson:"created" json:"created,omitempty"`
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
