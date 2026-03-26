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
		version INTEGER DEFAULT 0,
		created_at TIMESTAMPTZ
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

	_, err = db.Exec("CREATE INDEX IF NOT EXISTS idx_objects_created_at ON objects(created_at DESC)")

	if err != nil {
		return fmt.Errorf("create inde failed: %w", err)
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

	_, err = db.Exec(`CREATE OR REPLACE FUNCTION populate_objects_with_photos()
	RETURNS void AS $$
	DECLARE
		i INTEGER;
		article_text TEXT;
		name_text TEXT;
		price_value DECIMAL(10,2);
		characteristics_json JSONB;
		photo_count INTEGER;
		j INTEGER;
	BEGIN
		-- Генерация 60 товаров
		FOR i IN 1..60 LOOP
			article_text := 'ART' || LPAD(i::TEXT, 5, '0');
			name_text := 'Товар ' || i::TEXT || ' - ' || 
				CASE 
					WHEN i % 5 = 0 THEN 'Премиум'
					WHEN i % 3 = 0 THEN 'Стандарт'
					ELSE 'Эконом'
				END;
			price_value := 100 + (i * 165) % 9900;
			characteristics_json := jsonb_build_object(
				'вес', (500 + (i * 23) % 5000)::TEXT || ' г',
				'размер', 
					CASE (i % 5)
						WHEN 0 THEN 'XL'
						WHEN 1 THEN 'L'
						WHEN 2 THEN 'M'
						WHEN 3 THEN 'S'
						ELSE 'XS'
					END,
				'цвет', 
					CASE (i % 7)
						WHEN 0 THEN 'красный'
						WHEN 1 THEN 'синий'
						WHEN 2 THEN 'зеленый'
						WHEN 3 THEN 'желтый'
						WHEN 4 THEN 'черный'
						WHEN 5 THEN 'белый'
						ELSE 'серый'
					END,
				'материал',
					CASE (i % 4)
						WHEN 0 THEN 'хлопок'
						WHEN 1 THEN 'полиэстер'
						WHEN 2 THEN 'шерсть'
						ELSE 'нейлон'
					END,
				'страна',
					CASE (i % 5)
						WHEN 0 THEN 'Россия'
						WHEN 1 THEN 'Китай'
						WHEN 2 THEN 'Италия'
						WHEN 3 THEN 'Германия'
						ELSE 'Турция'
					END
			);
			
			INSERT INTO objects (article, name, price, characteristics, version)
			VALUES (article_text, name_text, price_value, characteristics_json, 1)
			ON CONFLICT (article) DO UPDATE SET
				name = EXCLUDED.name,
				price = EXCLUDED.price,
				characteristics = EXCLUDED.characteristics,
				version = objects.version + 1;
			
			photo_count := 1 + (i % 5);
			
			FOR j IN 1..photo_count LOOP
				INSERT INTO objects_photo (object_article, position, url)
				VALUES (
					article_text,
					j,
					'https://example.com/photos/' || article_text || '/photo_' || j::TEXT || '.jpg'
				)
				ON CONFLICT (object_article, position) DO UPDATE SET
					url = EXCLUDED.url;
			END LOOP;
		END LOOP;
		
		RAISE NOTICE 'Успешно добавлено 60 товаров с фотографиями';
	END;
	$$ LANGUAGE plpgsql`)

	if err != nil {
		return fmt.Errorf("create populate function failed: %w", err)
	}
	_, err = db.Exec("CREATE INDEX IF NOT EXISTS idx_objects_created_at ON objects(created_at DESC)")

	if err != nil {
		return fmt.Errorf("create inde failed: %w", err)
	}

	log.Println("Migration completed")
	return nil
}
