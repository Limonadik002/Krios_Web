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
	tx, err := d.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	charsJSON, err := json.Marshal(Obj.Characteristics)
	if err != nil {
		return fmt.Errorf("failed to marshal characteristics: %w", err)
	}

	_, err = tx.Exec(`INSERT INTO objects(article, name, price, parametrs_name, characteristics, created_at)
		VALUES($1,$2,$3,$4,$5,$6)`, Obj.Article, Obj.Name, Obj.Price, Obj.ParametrsName, charsJSON, Obj.Created_at)
	if err != nil {
		return fmt.Errorf("err insert into obj: %w", err)
	}

	for _, Photo := range Obj.Photos {
		_, err := tx.Exec(`INSERT INTO objects_photo(object_article,position,url)
			VALUES($1,$2,$3)`, Obj.Article, Photo.Position, Photo.UrlPhotos)
		if err != nil {
			return fmt.Errorf("err insert into obj photos: %w", err)
		}
	}

	return tx.Commit()
}

func (d *partRepo) UpdateInfoObj(art string, UpdateObj m.Object) error {
	charsJSON, err := json.Marshal(UpdateObj.Characteristics)
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

func (d *partRepo) AddOrdersFromDb(Orders []*m.Order, OrderId int) error {

	for _, Order := range Orders {
		_, err := d.db.Exec(`INSERT INTO list_of_obj(order_id,name,article,price,quantity,phone)
		VALUES($1,$2,$3,$4,$5,$6)`, OrderId, Order.Name, Order.Object_article, Order.Price, Order.Quantity, Order.Phone)

		if err != nil {
			return fmt.Errorf("failed to insert order to db: %w", err)
		}
	}
	return nil
}

func (d *partRepo) GetOrderId() (int, error) {
	var maxOrderID int
	err := d.db.QueryRow(`SELECT COALESCE(MAX(order_id), 0) FROM list_of_obj`).Scan(&maxOrderID)

	if err != nil {
		return 0, fmt.Errorf("failed to search order_id: %w", err)
	}
	return maxOrderID, nil
}

func (d *partRepo) GetObj(offset, limit int) ([]m.Object, error) {
	rows, err := d.db.Query(`SELECT article, name, price, parametrs_name, characteristics 
				FROM objects
				ORDER BY created_at DESC
				LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("Err select get arg obj offset limit%w", err)
	}
	defer rows.Close()

	objects := make([]m.Object, 0, limit)

	for rows.Next() {
		var obj m.Object
		var charsJSON []byte
		err := rows.Scan(&obj.Article, &obj.Name, &obj.Price, &obj.ParametrsName, &charsJSON)

		if err != nil {
			return nil, fmt.Errorf("scan get obj err %w", err)
		}

		if err = json.Unmarshal(charsJSON, &obj.Characteristics); err != nil {
			return nil, fmt.Errorf("unmarshal chars %w", err)
		}

		PhotoRows, err := d.db.Query("SELECT position, url FROM objects_photo WHERE object_article = $1", obj.Article)

		if err != nil {
			return nil, fmt.Errorf("Err select get arg photo offset limit%w", err)
		}

		var Photos []m.ObjPhoto

		for PhotoRows.Next() {
			var Photo m.ObjPhoto

			err := PhotoRows.Scan(&Photo.Position, &Photo.UrlPhotos)

			if err != nil {
				return nil, fmt.Errorf("scan get photos err %w", err)
			}

			Photos = append(Photos, Photo)
		}
		PhotoRows.Close()

		obj.Photos = Photos
		objects = append(objects, obj)
	}
	return objects, nil
}

func (d *partRepo) SearchObj(nameObj string) ([]m.RespSearch, error) {
	rows, err := d.db.Query(`SELECT article, name, price  FROM objects WHERE name ILIKE $1 ORDER BY name`, nameObj)

	if err != nil {
		return nil, fmt.Errorf("Err select search obj %w", err)
	}

	defer rows.Close()

	var RSO []m.RespSearch

	for rows.Next() {
		var searchObj m.RespSearch
		if err := rows.Scan(&searchObj.Article, &searchObj.Name, &searchObj.Price); err != nil {
			return nil, fmt.Errorf("scan search obj err %w", err)
		}
		RSO = append(RSO, searchObj)
	}
	return RSO, nil
}
