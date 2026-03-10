package internal

import (
	"fmt"

	m "github.com/vova1001/krios_proj/models"
)

type partService struct {
	repo *partRepo
}

func NewService(repo *partRepo) *partService {
	return &partService{repo: repo}
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
	art := UpdateObj.Article
	if err := s.repo.UpdateInfoObj(art, UpdateObj); err != nil {
		return err
	}
	return nil

}
