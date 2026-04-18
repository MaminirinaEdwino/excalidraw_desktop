package main

import (
	"embed"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strings"

	webview "github.com/webview/webview_go"
)

//go:embed ui-dist/*
var assets embed.FS
func SaveImage(base64Str string, svg64 string) {
    // 1. Retirer le préfixe "data:image/png;base64,"
    i := strings.Index(base64Str, ",")
    if i == -1 {
        return
    }
    rawStr := base64Str[i+1:]

    // 2. Décoder la base64
    data, err := base64.StdEncoding.DecodeString(rawStr)
    if err != nil {
        panic(err)
    }

    // 3. Sauvegarder sur le disque (dans le dossier de ton projet e-learning par exemple)
    err = os.WriteFile("export_excalidraw.png", data, 0644)
    if err != nil {
        panic(err)
    }
	err = os.WriteFile("export_excalidraw.svg",[]byte(svg64), 0644)
}
func main() {
	debug := true
	w := webview.New(debug)
	defer w.Destroy()
	w.SetTitle("Excalidraw DeskTop")
	w.SetSize(800, 600, webview.HintNone)
	go func() {
		fs := http.FileServer(http.FS(assets))
        http.ListenAndServe(":8080", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Optionnel : rediriger toutes les routes vers index.html pour le SPA Routing
            r.URL.Path = "/ui-dist" + r.URL.Path
            fs.ServeHTTP(w, r)
        }))
	}()
	w.Bind("saveImageToGo", func (data string, svg string){
		SaveImage(data, svg)
		fmt.Println(svg)
	})
	w.Navigate("http://localhost:8080")
	w.Run()

}