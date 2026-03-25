package models

import "time"

type Object struct {
	Article         string            `json:"article"`
	Name            string            `json:"name"`
	Price           float64           `json:"price"`
	ParametrsName   string            `json:"parametrs_name"`
	Characteristics map[string]string `json:"characteristics"`
	Created_at      time.Time         `json:"created_at"`
	Version         int               `json:"version"`
	Photos          []ObjPhoto        `json:"photos"`
}

type ObjPhoto struct {
	Object_article string `json:"obj_art"`
	Position       int    `json:"position"`
	UrlPhotos      string `json:"url_photos"`
}

type PresignRequest struct {
	Filenames []string `json:"filenames"`
}

type PresignItem struct {
	Key      string `json:"key"`
	UrlWrite string `json:"url_write"`
	UrlRead  string `json:"url_read"`
}

type PresignResponse struct {
	Items []PresignItem `json:"items"`
}

type Order struct {
	Name           string  `json:"name"`
	Object_article string  `json:"article"`
	Price          float64 `json:"price"`
	Quantity       int     `json:"quantity"`
	Phone          string  `json:"phone"`
}
