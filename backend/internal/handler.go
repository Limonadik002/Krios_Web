package internal

import (
	"encoding/json"
	"net/http"
	"strconv"

	midlwareAuth "github.com/vova1001/krios_proj/midlware"
	m "github.com/vova1001/krios_proj/models"
)

type partHandler struct {
	service *partService
}

func NewHandler(service *partService) *partHandler {
	return &partHandler{service: service}
}

func (h *partHandler) RegisterRouter(mux *http.ServeMux) {
	mux.HandleFunc("POST /Presign", midlwareAuth.AuthMidlleware(h.PresignedURL))
	mux.HandleFunc("POST /CreateNewObj", midlwareAuth.AuthMidlleware(h.CreateObj))
	mux.HandleFunc("PUT /UpdateObj", midlwareAuth.AuthMidlleware(h.UpdateObj))
	mux.HandleFunc("POST /AddOrders", midlwareAuth.AuthMidlleware(h.AddOrders))
	mux.HandleFunc("GET /GetObjects", midlwareAuth.AuthMidlleware(h.GetObjects))
	mux.HandleFunc("GET /GetObject", midlwareAuth.AuthMidlleware(h.GetObject))
	mux.HandleFunc("GET /SearchObjects", midlwareAuth.AuthMidlleware(h.SearchObj))
	mux.HandleFunc("DELETE /DeleteObj", midlwareAuth.AuthMidlleware(h.DeleteObj))
	mux.HandleFunc("POST /RegisterAdmin", h.RegisterAdmin)
}

func (h *partHandler) CreateObj(w http.ResponseWriter, r *http.Request) {
	var NewObj m.Object
	if err := json.NewDecoder(r.Body).Decode(&NewObj); err != nil {
		http.Error(w, "not valid json", 400)
		return
	}
	if err := h.service.CreateObj(NewObj); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(200)

}

func (h *partHandler) UpdateObj(w http.ResponseWriter, r *http.Request) {
	var UpdateObj m.Object
	art := r.URL.Query().Get("art")
	if err := json.NewDecoder(r.Body).Decode(&UpdateObj); err != nil {
		http.Error(w, "not valid json", 400)
		return
	}
	if err := h.service.UpdateObj(UpdateObj, art); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)

}

func (h *partHandler) GetObjects(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")
	limit := r.URL.Query().Get("limit")
	ctx := r.Context()

	pageInt, err := strconv.Atoi(page)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	resObjs, err := h.service.GetObjects(pageInt, limitInt, ctx)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(resObjs); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

}

func (h *partHandler) GetObject(w http.ResponseWriter, r *http.Request) {
	art := r.URL.Query().Get("art")
	obj, err := h.service.GetObject(art)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(obj)
}

func (h *partHandler) PresignedURL(w http.ResponseWriter, r *http.Request) {
	var PresignReq m.PresignRequest
	ctx := r.Context()
	if err := json.NewDecoder(r.Body).Decode(&PresignReq); err != nil {
		http.Error(w, "not valid json", 400)
		return
	}
	PresignResponse, err := h.service.GeneratePresignedURLs(ctx, &PresignReq)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(PresignResponse)

}

func (h *partHandler) SearchObj(w http.ResponseWriter, r *http.Request) {
	Sname := r.URL.Query().Get("search")
	res, err := h.service.SearchObj(Sname)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(*res); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

}

func (h *partHandler) DeleteObj(w http.ResponseWriter, r *http.Request) {
	ArticuleForDelete := r.URL.Query().Get("articule")
	if err := h.service.DeleteObj(ArticuleForDelete); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)

}

func (h *partHandler) AddOrders(w http.ResponseWriter, r *http.Request) {
	Orders := make([]*m.Order, 0)
	if err := json.NewDecoder(r.Body).Decode(&Orders); err != nil {
		http.Error(w, "not valid json", 400)
		return
	}
	if err := h.service.AddOrders(Orders); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	if err := h.service.SendOrderToMe(Orders); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}

func (h *partHandler) RegisterAdmin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserPass string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "not valid json", 400)
		return
	}

	token, err := h.service.RegisterAdmin(req.UserPass)
	if err != nil {
		if err.Error() == "Error pass" {
			http.Error(w, "invalid password", 401)
			return
		}
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(token)
}
