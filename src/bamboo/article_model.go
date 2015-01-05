package bamboo

import (
    "time"
    "gopkg.in/mgo.v2/bson"
)

type Favarite struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Article bson.ObjectId `bson:"article" json:"article,omitempty"`
    Date time.Time `bson:"date" json:"date,omitempty"`
}

type Article struct {
    Id bson.ObjectId `bson:"_id" json:"id"`
    User bson.ObjectId `bson:"user" json:"user,omitempty"`
    Title string `bson:"title" json:"title"`
    Content string `bson:"content" json:"content,omitempty"`
    LastContent string `bson:"last_content" json:"last_content,omitempty"`
    Created time.Time `bson:"created" json:"created,omitempty"`
    Updated time.Time `bson:"updated" json:"updated,omitempty"`
    Like []bson.ObjectId `bson:"like" json:"like,omitempty"`
    Circle []string `bson:"circle" json:"circle,omitempty"`
    Read uint `bson:"read" json:"read,omitempty"`
    Public bool `bson:"public" json:"public,omitempty"`
    Change uint `bson:"change" json:"change,omitempty"`
}

func articleUpdate(userId string, articleId string, title string, content string, circles []interface{}, public bool) string {
    var err error
    var objId bson.ObjectId
    user := bson.ObjectIdHex(userId)
    // update article
    if bson.IsObjectIdHex(articleId) {
        objId = bson.ObjectIdHex(articleId)
        // get last content
        ret := &Article{}
        err = db.article.FindId(objId).One(ret)
        if err == nil {
            lastContent := ret.Content
            err = db.article.Update(
                bson.M{"_id": objId, "user": user},
                bson.M{
                    "$set": bson.M{
                        "title": title,
                        "content": content,
                        "last_content": lastContent,
                        "updated": time.Now(),
                        "circle": circles,
                        "public": public,
                    },
                },
            )
        }
    } else {
        // create article
        objId = bson.NewObjectId()
        now := time.Now()
        err = db.article.Insert(bson.M{
            "_id": objId,
            "user": user,
            "title": title,
            "content": content,
            "last_content": content,
            "created": now,
            "updated": now,
            "circle": circles,
            "public": public,
        })
    }
    if err == nil {
        return objId.Hex()
    }
    return ""
}

func articleList(userId string, filter string) *[]Article {
    var err error
    user := bson.ObjectIdHex(userId)
    ret := make([]Article, 0)
    if filter == "public" {
        err = db.article.Find(bson.M{"user": user, "public": true}).All(&ret)
    } else if filter == "private" {
        err = db.article.Find(bson.M{"user": user, "public": false}).All(&ret)
    } else if filter == "favarite" {
        // get user favarite article
        favariteInfo := make([]Favarite, 0)
        db.favarite.Find(bson.M{"user": user}).All(&favariteInfo)
        aritcleID := make([]bson.ObjectId, 0)
        for _, favarite := range favariteInfo {
            aritcleID = append(aritcleID, favarite.Article)
        }
        err = db.article.Find(bson.M{"public": true, "_id": bson.M{"$in": aritcleID}}).All(&ret)
    }
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

func articleReadCount(articleId string) bool {
    err := db.article.Update(
        bson.M{"_id": bson.ObjectIdHex(articleId)},
        bson.M{"$inc":  bson.M{
            "read": 1,
        },
    })
    if err == nil {
        return true
    }
    return false
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

func articleFavarite(userId string, articleId string, isFavarite bool) bool {
    user := bson.ObjectIdHex(userId)
    article := bson.ObjectIdHex(articleId)
    var err error
    if isFavarite {
        _, err = db.favarite.Upsert(bson.M{
            "user": user,
            "article": article,
        }, bson.M{
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
