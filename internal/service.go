package internal

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	m "github.com/vova1001/krios_proj/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type partService struct {
	repo      *partRepo
	s3Client  *s3.Client
	bucket    string
	publicURL string
}

func NewService(repo *partRepo, s3Client *s3.Client, bucket, pubURL string) *partService {
	return &partService{
		repo:      repo,
		s3Client:  s3Client,
		bucket:    bucket,
		publicURL: pubURL,
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

func (s *partService) GeneratePresignedURL(ctx context.Context, req *m.PresignRequest) (*m.PresignResponse, error) {
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

		reqPresign, err := presignedClient.PresignPutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
		}, s3.WithPresignExpires(15*time.Minute))

		if err != nil {
			return nil, fmt.Errorf("field presign for %s, err:%w", filesName, err)
		}

		PresignedURLs[i] = m.PresignItem{
			Key:          key,
			PresignedURL: reqPresign.URL,
			PublicURL:    fmt.Sprintf("%s/%s/%s", s.publicURL, s.bucket, key),
		}
	}
	return &m.PresignResponse{Items: PresignedURLs}, nil
}
