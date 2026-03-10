package models

type Object struct {
	Article         string            `json:"article"`
	Name            string            `json:"name"`
	Photo           string            `json:"photo"`
	Price           float64           `json:"price"`
	ParametrsName   string            `json:"parametrs_name"`
	Сharacteristics map[string]string `json:"characteristics"`
	Version         int               `json:"version"`
}
