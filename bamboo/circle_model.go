package bamboo

import (
    // "fmt"
    "gopkg.in/mgo.v2/bson"
)

func circleFocus(userId string, circle string, isFocus bool) bool {
    user := bson.ObjectIdHex(userId)
    var err error
    operate := "$addToSet"
    if !isFocus {
        operate = "$pull"
    }
    err = db.user.Update(
        bson.M{"_id": user},
        bson.M{
            operate: bson.M{
                "circle": circle,
            },
        },
    )
    if err == nil {
        return true
    }
    return false
}
