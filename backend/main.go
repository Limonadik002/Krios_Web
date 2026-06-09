package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	c "github.com/vova1001/krios_proj/config"
	d "github.com/vova1001/krios_proj/db_init"
	internal "github.com/vova1001/krios_proj/internal"
	"github.com/vova1001/krios_proj/midlware"
)

func main() {
	cfgS3, err := c.LoadCfgS3()
	if err != nil {
		log.Fatalf("err load cfg:%v", err)
	}
	cfgClientS3, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(cfgS3.Region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(cfgS3.AccessKey, cfgS3.SecretKey, "")))

	if err != nil {
		log.Fatal(err)
	}
	clientS3 := s3.NewFromConfig(cfgClientS3, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(cfgS3.Endpoint)
		o.UsePathStyle = true
	})

	_, err = clientS3.ListBuckets(context.TODO(), &s3.ListBucketsInput{})
	if err != nil {
		log.Fatalf("S3 connection failed: %v", err)
	}
	log.Println("S3 client ready")

	cfgg, err := c.LoadCfgDB()
	if err != nil {
		log.Fatalf("err load cfg:%v", err)
	}

	db, err := d.DBinit(cfgg)
	if err != nil {
		log.Fatalf("err conect from db: %v", err)
	}

	cfgEmailBot, err := c.LoadCfgEmailBot()
	if err != nil {
		log.Fatalf("err load cfg:%v", err)
	}

	if err = d.Migrate(db); err != nil {
		log.Fatalf("migrate err:%v", err)
	}
	repo := internal.NewRepository(db)
	service := internal.NewService(repo, clientS3, cfgS3.Bucket, cfgS3.Endpoint, cfgEmailBot)
	handler := internal.NewHandler(service)

	mux := http.DefaultServeMux
	handler.RegisterRouter(mux)

	corsHandler := midlware.CorsMiddleware(mux)

	server := http.Server{
		Addr:         ":8080",
		Handler:      corsHandler,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	go func() {
		fmt.Println("Server is up")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	server.SetKeepAlivesEnabled(false)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err = server.Shutdown(ctx); err != nil {
		log.Fatalf("Err shutdown:%v", err)
	}

	fmt.Println("Shutdown sucssefull")

}
