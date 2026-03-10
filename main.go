package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	c "github.com/vova1001/krios_proj/config"
	d "github.com/vova1001/krios_proj/db_init"
	internal "github.com/vova1001/krios_proj/internal"
)

func main() {

	cfg, err := c.LoadCfgDB()
	if err != nil {
		log.Fatal("err load cfg:%w", err)
	}

	db, err := d.DBinit(cfg)
	if err != nil {
		log.Fatal("err conect from db: %w", err)
	}

	d.Migrate(db)
	repo := internal.NewRepository(db)
	service := internal.NewService(repo)
	handler := internal.NewHandler(service)

	mux := http.DefaultServeMux
	handler.RegisterRouter(mux)

	server := http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	fmt.Println("Server is up")
	log.Fatal(server.ListenAndServe(), "Server is dead")
}
