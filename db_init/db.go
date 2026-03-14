package dbinit

import (
	"database/sql"
	"fmt"
	"log"

	c "github.com/vova1001/krios_proj/config"

	_ "github.com/lib/pq"
)

func DBinit(cfgDB *c.ConfigDB) (*sql.DB, error) {
	conectStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfgDB.DBHost, cfgDB.DBPort, cfgDB.DBUser, cfgDB.DBPass, cfgDB.DBName, cfgDB.DBSSLMode)

	db, err := sql.Open("postgres", conectStr)
	if err != nil {
		log.Fatal("error creat and open db: %w", err)
	}

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("error ping db: %w", err)
	}

	return db, nil
}

func Migrate(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS objects(
		id SERIAL PRIMARY KEY,
		article TEXT UNIQUE NOT NULL,
		name TEXT NOT NULL,
		price DECIMAL(10,2) NOT NULL,
		parametrs_name TEXT,
		characteristics JSONB NOT NULL DEFAULT '{}',
		version INTEGER DEFAULT 0
	)`)

	if err != nil {
		return fmt.Errorf("create obj failed: %w", err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS objects_photo(
		object_article TEXT NOT NULL,
		position INT NOT NULL,
		url TEXT NOT NULL,
		PRIMARY KEY (object_article, position),
		FOREIGN KEY (object_article) REFERENCES objects(article) ON DELETE CASCADE
	)`)

	if err != nil {
		return fmt.Errorf("create obj_photo failed: %w", err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS list_of_obj(
		id SERIAL PRIMARY KEY,
		order_id INT NOT NULL DEFAULT 0,
		name TEXT NOT NULL,
		article TEXT NOT NULL,
		price DECIMAL(10,2) NOT NULL,
		quantity  INT CHECK (quantity > 0),
		phone VARCHAR(255) NOT NULL,
		created_at TIMESTAMPTZ DEFAULT NOW()
	)`)

	if err != nil {
		return fmt.Errorf("create list_of_obj failed: %w", err)
	}

	log.Println("Migration completed")
	return nil
}
