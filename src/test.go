package main

import (
	"net/http"
	"bytes"
	"fmt"
	"io/ioutil"
)

func main() {
	doGetClient("http://localhost:9090/")
}

func doGetClient(url string) {
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, bytes.NewReader([]byte("")))
	req.Header.Add("User-Agent", "myClient")
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}
