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
		VALUES($1,$2,$3,$4,$5,$6)`, Obj.Article, Obj.Name, Obj.Photos, Obj.Price, Obj.ParametrsName, charsJSON)
	if err != nil {
		return fmt.Errorf("err insert into obj: %w", err)
	}
	return nil
}

func (d *partRepo) UpdateInfoObj(art string, UpdateObj m.Object) error {
	charsJSON, err := json.Marshal(UpdateObj.Сharacteristics)
	if err != nil {
		return fmt.Errorf("failed to marshal characteristics: %w", err)
	}
	res, err := d.db.Exec(`UPDATE objects SET article=$1, name=$2, photo=$3, price=$4, parametrs_name=$5, characteristics=$6, version=version+1
		WHERE article=$1 AND version=$7`, UpdateObj.Article, UpdateObj.Name, UpdateObj.Photos, UpdateObj.Price, UpdateObj.ParametrsName, charsJSON, UpdateObj.Version)
	if err != nil {
		return err
	}
	rows, _ := res.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
