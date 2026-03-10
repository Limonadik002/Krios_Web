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
		photo TEXT,
		price DECIMAL(10,2) NOT NULL,
		parametrs_name TEXT,
		characteristics JSONB NOT NULL DEFAULT '{}',
		version INTEGER DEFAULT 0
	)`)

	if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("Migration completed")
	return nil
}
