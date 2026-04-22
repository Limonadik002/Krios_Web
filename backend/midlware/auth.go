package midlware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
)

func AuthMidlleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		UserToken := r.Header.Get("Authorization")
		parts := strings.SplitN(UserToken, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "not found bearer", 401)
			return
		}
		tokenSoul := parts[1]
		token, err := jwt.Parse(tokenSoul, func(t *jwt.Token) (interface{}, error) {
			if t.Method != jwt.SigningMethodHS256 {
				return nil, fmt.Errorf("error method token")
			}
			return []byte(os.Getenv("JWT_KEY")), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, err.Error(), 500)
			return
		}
		next(w, r)
	}
}
