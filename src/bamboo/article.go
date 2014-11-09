package bamboo

import (
    "strconv"
)

func ArticleUpdate(id int, userId int, title string, content string) int {
    if id == 0 {
        ret := insert(article, MapData{
            "user": userId,
            "title": title,
            "content": content,
        })
        if ret != 0 {
            return ret
        }

    } else {
        data, _ := article.Read(id)
        if data["user"] == userId {
            err := article.Update(id, MapData{
                "title": title,
                "content": content,
            })
            if err == nil {
                return id
            }
        }
    }
    return 0
}

func ArticleList(userId int) []MapData {
    ret := query(article, `[{"eq": ` + strconv.Itoa(userId) + `, "in": ["user"]}]`)
    retAry := make([]MapData, 0)
    for id := range ret {
		data, _ := article.Read(id)
		retAry = append(retAry, data)
	}
    return retAry
}
