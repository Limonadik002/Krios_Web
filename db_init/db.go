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

	_, err = db.Exec(`CREATE OR REPLACE FUNCTION populate_objects_with_photos()
RETURNS void AS $$
DECLARE
    i INTEGER;
    article_text TEXT;
    name_text TEXT;
    price_value DECIMAL(10,2);
    parametrs_name_text TEXT;
    characteristics_json JSONB;
    photo_count INTEGER;
    j INTEGER;
    created_at_value TIMESTAMPTZ;
BEGIN
    FOR i IN 1..30 LOOP
        -- Артикул
        article_text := 'ART' || LPAD(i::TEXT, 5, '0');
        
        -- Названия товаров
        CASE i
            WHEN 1 THEN name_text := 'Смартфон Apple iPhone 15';
            WHEN 2 THEN name_text := 'Смартфон Samsung Galaxy S24';
            WHEN 3 THEN name_text := 'Ноутбук Apple MacBook Air';
            WHEN 4 THEN name_text := 'Ноутбук ASUS ROG';
            WHEN 5 THEN name_text := 'Телевизор LG OLED';
            WHEN 6 THEN name_text := 'Телевизор Samsung QLED';
            WHEN 7 THEN name_text := 'Наушники Sony WH-1000XM5';
            WHEN 8 THEN name_text := 'Наушники AirPods Pro';
            WHEN 9 THEN name_text := 'Планшет iPad Pro';
            WHEN 10 THEN name_text := 'Планшет Samsung Tab S9';
            WHEN 11 THEN name_text := 'Часы Apple Watch Series 9';
            WHEN 12 THEN name_text := 'Часы Samsung Galaxy Watch 6';
            WHEN 13 THEN name_text := 'Фотоаппарат Canon EOS R6';
            WHEN 14 THEN name_text := 'Фотоаппарат Sony A7 IV';
            WHEN 15 THEN name_text := 'Колонка JBL Charge 5';
            WHEN 16 THEN name_text := 'Колонка Yandex Station';
            WHEN 17 THEN name_text := 'Робот-пылесос Xiaomi';
            WHEN 18 THEN name_text := 'Робот-пылесос Roborock';
            WHEN 19 THEN name_text := 'Микроволновка Samsung';
            WHEN 20 THEN name_text := 'Холодильник LG';
            WHEN 21 THEN name_text := 'Стиральная машина Bosch';
            WHEN 22 THEN name_text := 'Кофемашина DeLonghi';
            WHEN 23 THEN name_text := 'Электросамокат Ninebot';
            WHEN 24 THEN name_text := 'Велосипед Stels';
            WHEN 25 THEN name_text := 'Монитор Dell UltraSharp';
            WHEN 26 THEN name_text := 'Клавиатура Logitech MX';
            WHEN 27 THEN name_text := 'Мышь Logitech Master';
            WHEN 28 THEN name_text := 'Внешний диск Samsung T7';
            WHEN 29 THEN name_text := 'Флешка Kingston';
            WHEN 30 THEN name_text := 'Зарядное устройство Belkin';
        END CASE;
        
        -- Цены
        CASE i
            WHEN 1 THEN price_value := 79990;
            WHEN 2 THEN price_value := 69990;
            WHEN 3 THEN price_value := 89990;
            WHEN 4 THEN price_value := 129990;
            WHEN 5 THEN price_value := 59990;
            WHEN 6 THEN price_value := 45990;
            WHEN 7 THEN price_value := 29990;
            WHEN 8 THEN price_value := 19990;
            WHEN 9 THEN price_value := 69990;
            WHEN 10 THEN price_value := 49990;
            WHEN 11 THEN price_value := 29990;
            WHEN 12 THEN price_value := 19990;
            WHEN 13 THEN price_value := 159990;
            WHEN 14 THEN price_value := 189990;
            WHEN 15 THEN price_value := 12990;
            WHEN 16 THEN price_value := 15990;
            WHEN 17 THEN price_value := 29990;
            WHEN 18 THEN price_value := 39990;
            WHEN 19 THEN price_value := 8990;
            WHEN 20 THEN price_value := 45990;
            WHEN 21 THEN price_value := 35990;
            WHEN 22 THEN price_value := 49990;
            WHEN 23 THEN price_value := 39990;
            WHEN 24 THEN price_value := 29990;
            WHEN 25 THEN price_value := 34990;
            WHEN 26 THEN price_value := 12990;
            WHEN 27 THEN price_value := 8990;
            WHEN 28 THEN price_value := 8990;
            WHEN 29 THEN price_value := 1990;
            WHEN 30 THEN price_value := 2990;
        END CASE;
        
        parametrs_name_text := 'Характеристики ' || name_text;
        created_at_value := NOW() - (random() * 30 || ' days')::INTERVAL;
        
        characteristics_json := jsonb_build_object(
            'бренд', split_part(name_text, ' ', 1),
            'наличие', 'в наличии',
            'гарантия', (12 + (i % 24))::TEXT || ' мес'
        );
        
        INSERT INTO objects (article, name, price, parametrs_name, characteristics, version, created_at)
        VALUES (article_text, name_text, price_value, parametrs_name_text, characteristics_json, 1, created_at_value)
        ON CONFLICT (article) DO NOTHING;
        
        photo_count := 1 + (i % 5);
        
        FOR j IN 1..photo_count LOOP
            INSERT INTO objects_photo (object_article, position, url)
            VALUES (article_text, j, 'https://example.com/photos/' || article_text || '/' || j::TEXT || '.jpg')
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Добавлено 30 товаров';
END;
$$ LANGUAGE plpgsql`)

	if err != nil {
		return fmt.Errorf("create function failed: %w", err)
	}

	// Вызов функции
	_, err = db.Exec("SELECT populate_objects_with_photos()")
	if err != nil {
		log.Printf("populate warning: %v", err)
	}
	_, err = db.Exec("CREATE INDEX IF NOT EXISTS idx_objects_created_at ON objects(created_at DESC)")

	if err != nil {
		return fmt.Errorf("create inde failed: %w", err)
	}

	log.Println("Migration completed")
	return nil
}
