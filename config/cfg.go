package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type ConfigDB struct {
	DBHost    string
	DBName    string
	DBPass    string
	DBPort    string
	DBUser    string
	DBSSLMode string
}

type ConfigS3 struct {
	Endpoint  string
	Region    string
	Bucket    string
	AccessKey string
	SecretKey string
}

func LoadCfgDB() (*ConfigDB, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(".env not found")
	}
	cfgBD := &ConfigDB{
		DBHost:    os.Getenv("DB_HOST"),
		DBName:    os.Getenv("DB_NAME"),
		DBPass:    os.Getenv("DB_PASS"),
		DBPort:    os.Getenv("DB_PORT"),
		DBUser:    os.Getenv("DB_USER"),
		DBSSLMode: os.Getenv("DB_SSLMODE"),
	}
	return cfgBD, nil
}

func LoadCfgS3() (*ConfigS3, error) {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal(".env S3 not found")
	}
	cfgS3 := &ConfigS3{
		Endpoint:  os.Getenv("S3_ENDPOINT"),
		Region:    os.Getenv("S3_REGION"),
		Bucket:    os.Getenv("S3_BUCKET"),
		AccessKey: os.Getenv("S3_ACCESS_KEY_ID"),
		SecretKey: os.Getenv("S3_SECRET_ACCESS_KEY"),
	}
	return cfgS3, nil
}
