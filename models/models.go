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
