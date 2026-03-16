package internal

import (
	"context"
	"crypto/tls"
	"fmt"
	"net/smtp"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	m "github.com/vova1001/krios_proj/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	c "github.com/vova1001/krios_proj/config"
)

type partService struct {
	repo        *partRepo
	s3Client    *s3.Client
	bucket      string
	publicURL   string
	cfgEmailBot *c.ConfigEmailBot
}

func NewService(repo *partRepo, s3Client *s3.Client, bucket, pubURL string, cfgEmailBot *c.ConfigEmailBot) *partService {
	return &partService{
		repo:        repo,
		s3Client:    s3Client,
		bucket:      bucket,
		publicURL:   pubURL,
		cfgEmailBot: cfgEmailBot,
	}
}

// потом мб валидацию добавить(если будет нужно, на фронт возвращать это)
func (s *partService) CreateObj(Obj m.Object) error {
	if err := s.repo.AddObjFromDB(Obj); err != nil {
		return fmt.Errorf("err:%w", err)
	}

	return nil
}

// Срочно добавить валидацию пришедших полей, не занят ли артикул и тд завтра
func (s *partService) UpdateObj(UpdateObj m.Object) error {
	if UpdateObj.Name == "" {
		return fmt.Errorf("")
	}

	art := UpdateObj.Article
	if err := s.repo.UpdateInfoObj(art, UpdateObj); err != nil {
		return err
	}

	return nil
}

func (s *partService) GeneratePresignedURLs(ctx context.Context, req *m.PresignRequest) (*m.PresignResponse, error) {
	if len(req.Filenames) == 0 {
		return nil, fmt.Errorf("request empty")
	}

	presignedClient := s3.NewPresignClient(s.s3Client)
	PresignedURLs := make([]m.PresignItem, len(req.Filenames))

	for i, filesName := range req.Filenames {

		ext := filepath.Ext(filesName)
		if ext == "" {
			ext = ".bin"
		}

		key := fmt.Sprintf("%s%s", uuid.New().String(), ext)

		PresignWriteUrl, err := presignedClient.PresignPutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
		}, s3.WithPresignExpires(15*time.Minute))

		if err != nil {
			return nil, fmt.Errorf("field presign for %s, err:%w", filesName, err)
		}

		PresignedURLs[i] = m.PresignItem{
			Key:      key,
			UrlWrite: PresignWriteUrl.URL,
			UrlRead:  fmt.Sprintf("%s/%s/%s", s.publicURL, s.bucket, key),
		}
	}
	return &m.PresignResponse{Items: PresignedURLs}, nil
}

func (s *partService) AddOrders(Orders []*m.Order) error {
	OrderID, err := s.repo.GetOrderId()
	if err != nil {
		return fmt.Errorf("failed to get max order id: %w", err)
	}
	nextOrderID := OrderID + 1

	if err := s.repo.AddOrdersFromDb(Orders, nextOrderID); err != nil {
		return fmt.Errorf("err:%w", err)
	}
	return nil
}

func (s *partService) SendOrderToMe(orderItems []*m.Order) error {
	if s.cfgEmailBot == nil {
		return fmt.Errorf("email bot config is nil")
	}
	if len(orderItems) == 0 {
		return nil
	}

	// Подсчитываем общую сумму
	totalSum := 0.0
	for _, item := range orderItems {
		totalSum += float64(item.Quantity) * item.Price
	}

	// Получаем текущую дату
	currentDateTime := time.Now().Format("02.01.2006 15:04:05")
	currentDate := time.Now().Format("02.01.2006")
	phone := orderItems[0].Phone
	itemsCount := len(orderItems)

	// Формируем HTML (сумма только в итоговой строке таблицы)
	html := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					font-family: Arial, sans-serif;
					line-height: 1.6;
					color: #333;
					max-width: 800px;
					margin: 0 auto;
					padding: 20px;
				}
				.header {
					margin-bottom: 20px;
					padding-bottom: 10px;
					border-bottom: 2px solid #667eea;
				}
				.datetime {
					color: #666;
					font-size: 14px;
				}
				.phone {
					background: #28a745;
					color: white;
					padding: 8px 15px;
					border-radius: 50px;
					display: inline-block;
					font-size: 18px;
					font-weight: bold;
					margin: 10px 0;
				}
				table {
					width: 100%%;
					border-collapse: collapse;
					margin: 20px 0;
					box-shadow: 0 2px 3px rgba(0,0,0,0.1);
				}
				th {
					background-color: #667eea;
					color: white;
					padding: 12px;
					text-align: left;
					font-size: 14px;
				}
				td {
					padding: 12px;
					border-bottom: 1px solid #ddd;
				}
				tr:hover {
					background-color: #f5f5f5;
				}
				.total-row {
					background-color: #e8f4f8;
					font-weight: bold;
					font-size: 16px;
				}
				.article {
					font-family: monospace;
					background: #f0f0f0;
					padding: 2px 6px;
					border-radius: 4px;
					font-size: 13px;
				}
				.price {
					color: #28a745;
					font-weight: bold;
				}
				.sum {
					color: #dc3545;
					font-weight: bold;
				}
				.product-name {
					max-width: 250px;
					color: #555;
				}
			</style>
		</head>
		<body>
			<div class="header">
				<div class="datetime">%s</div>
				<div class="phone">📞 %s</div>
			</div>
			
			<h3>🛍 Состав заказа (%d позиций)</h3>
			
			<table>
				<thead>
					<tr>
						<th>№</th>
						<th>Артикул</th>
						<th>Наименование</th>
						<th>Цена</th>
						<th>Кол-во</th>
						<th>Сумма</th>
					</tr>
				</thead>
				<tbody>`,
		currentDateTime, phone, itemsCount)

	// Добавляем строки таблицы с названием товара
	for i, item := range orderItems {
		itemSum := float64(item.Quantity) * item.Price
		html += fmt.Sprintf(`
					<tr>
						<td>%d</td>
						<td><span class="article">%s</span></td>
						<td class="product-name">%s</td>
						<td class="price">%.2f ₽</td>
						<td><b>%d</b> шт.</td>
						<td class="sum">%.2f ₽</td>
					</tr>`,
			i+1, item.Object_article, item.Name, item.Price, item.Quantity, itemSum)
	}

	// Добавляем итоговую строку с общей суммой
	html += fmt.Sprintf(`
					<tr class="total-row">
						<td colspan="5" style="text-align: right;"><b>ИТОГО:</b></td>
						<td><b>%.2f ₽</b></td>
					</tr>`, totalSum)

	// Закрываем таблицу и body
	html += `
				</tbody>
			</table>
		</body>
		</html>`

	// Формируем тему письма
	subject := fmt.Sprintf("заказ krios от %s", currentDate)

	// Формируем полное сообщение
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=\"utf-8\"\r\n"+
		"\r\n"+
		"%s\r\n", s.cfgEmailBot.MyEmail, subject, html))

	// Отправка через STARTTLS
	addr := fmt.Sprintf("%s:%s", s.cfgEmailBot.SmtpHost, s.cfgEmailBot.SmtpPort)
	client, err := smtp.Dial(addr)
	if err != nil {
		return fmt.Errorf("ошибка подключения к SMTP: %w", err)
	}
	defer client.Close()

	tlsConfig := &tls.Config{
		ServerName: s.cfgEmailBot.SmtpHost,
	}
	if err = client.StartTLS(tlsConfig); err != nil {
		return fmt.Errorf("ошибка STARTTLS: %w", err)
	}

	auth := smtp.PlainAuth("",
		s.cfgEmailBot.EmailBot,
		s.cfgEmailBot.EmailPass,
		s.cfgEmailBot.SmtpHost)

	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("ошибка аутентификации: %w", err)
	}

	if err = client.Mail(s.cfgEmailBot.EmailBot); err != nil {
		return fmt.Errorf("ошибка указания отправителя: %w", err)
	}

	if err = client.Rcpt(s.cfgEmailBot.MyEmail); err != nil {
		return fmt.Errorf("ошибка указания получателя: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("ошибка открытия потока данных: %w", err)
	}

	_, err = w.Write(msg)
	if err != nil {
		return fmt.Errorf("ошибка записи письма: %w", err)
	}

	err = w.Close()
	if err != nil {
		return fmt.Errorf("ошибка закрытия потока: %w", err)
	}

	return client.Quit()
}
