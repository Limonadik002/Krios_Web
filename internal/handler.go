package internal

import (
	"encoding/json"
	"net/http"

	m "github.com/vova1001/krios_proj/models"
)

type partHandler struct {
	service *partService
}

func NewHandler(service *partService) *partHandler {
	return &partHandler{service: service}
}

func (h *partHandler) RegisterRouter(mux *http.ServeMux) {
	mux.HandleFunc("POST /Presign", h.PresignedURL)
	mux.HandleFunc("POST /CreateNewObj", h.CreateObj)
	mux.HandleFunc("PUT /UpdateObj", h.UpdateObj)
	mux.HandleFunc("POST /AddOrders", h.AddOrders)
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
	w.Header().Set("Contenet-type", "application/json")
	w.WriteHeader(200)

}

func (h *partHandler) UpdateObj(w http.ResponseWriter, r *http.Request) {
	var UpdateObj m.Object
	if err := json.NewDecoder(r.Body).Decode(&UpdateObj); err != nil {
		http.Error(w, "not valid json", 400)
		return
	}
	if err := h.service.UpdateObj(UpdateObj); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)

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
