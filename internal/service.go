package internal

import (
	"context"
	"fmt"

	m "github.com/vova1001/krios_proj/models"

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

func (s *partService) GeneratePresignedURL(ctx context.Context, req *m.PresignRequest)
