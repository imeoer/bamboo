package bamboo

// check user if exist
func UserExist(mail string) bool {
    ret := query(user, `[
        {"eq": "` + mail + `", "in": ["mail"]}
    ]`)
    if len(ret) == 0 {
        return false
    }
    return true
}

// rgister new user
func UserRegister(mail string, pass string) bool {
    ret := insert(user, mapData{
        "mail": mail,
        "pass": pass,
    })
    if ret == 0 {
        return false
    }
    return true
}

// user login
func UserLogin(mail string, pass string) bool {
    ret := query(user, `{"n": [
        {"eq": "` + mail + `", "in": ["mail"]},
        {"eq": "` + pass + `", "in": ["pass"]}
    ]}`)
    if len(ret) == 0 {
        return false
    }
    return true
}
