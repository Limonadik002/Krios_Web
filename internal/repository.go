package internal

import (
	"database/sql"
	"encoding/json"
	"fmt"

	m "github.com/vova1001/krios_proj/models"
)

type partRepo struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *partRepo {
	return &partRepo{db: db}
}

func (d *partRepo) AddObjFromDB(Obj m.Object) error {

	charsJSON, err := json.Marshal(Obj.Сharacteristics)
	if err != nil {
		return fmt.Errorf("failed to marshal characteristics: %w", err)
	}

	_, err = d.db.Exec(`INSERT INTO objects(article, name, photo, price, parametrs_name, characteristics)
		VALUES($1,$2,$3,$4,$5,$6)`, Obj.Article, Obj.Name, Obj.Photo, Obj.Price, Obj.ParametrsName, charsJSON)
	if err != nil {
		return fmt.Errorf("err insert into obj: %w", err)
	}
	return nil
}
