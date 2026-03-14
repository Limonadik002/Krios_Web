package models

type Object struct {
	Article         string            `json:"article"`
	Name            string            `json:"name"`
	Price           float64           `json:"price"`
	ParametrsName   string            `json:"parametrs_name"`
	Photos          []ObjPhoto        `json:"photos"`
	Сharacteristics map[string]string `json:"characteristics"`
	Version         int               `json:"version"`
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
	Key          string `json:"key"`
	PresignedURL string `json:"presigned_url"`
	PublicURL    string `json:"public_url"`
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
