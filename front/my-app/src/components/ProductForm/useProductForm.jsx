import { useState } from "react";

export function useProductForm(initialValues = {}) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [article, setArticle] = useState(initialValues.article || "");
  const [price, setPrice] = useState(initialValues.price || "");
  const [params, setParams] = useState(initialValues.params || []);
  const [editingField, setEditingField] = useState(null);

  const startEdit = (fieldName) => {
    setEditingField(fieldName);
  };

  const saveEdit = () => {
    setEditingField(null);
  };

  const clearTitle = () => {
    setTitle("");
    setEditingField(null);
  };

  const clearArticle = () => {
    setArticle("");
    setEditingField(null);
  };

  const clearPrice = () => {
    setPrice("");
    setEditingField(null);
  };

  const addParam = () => {
    setParams((prev) => [...prev, `Параметр ${prev.length + 1}`]);
  };

  const changeParam = (index, value) => {
    setParams((prev) =>
      prev.map((param, paramIndex) =>
        paramIndex === index ? value : param
      )
    );
  };

  const deleteParam = (index) => {
    setParams((prev) => prev.filter((_, paramIndex) => paramIndex !== index));
    setEditingField(null);
  };

  const fillForm = (product) => {
    setTitle(product.title || product.name || "");
    setArticle(product.article || product.vendor_code || "");
    setPrice(product.price || "");
    setParams(product.params || product.parameters || []);
    setEditingField(null);
  };

  const resetForm = () => {
    setTitle("");
    setArticle("");
    setPrice("");
    setParams([]);
    setEditingField(null);
  };

  return {
    title,
    setTitle,
    article,
    setArticle,
    price,
    setPrice,
    params,
    setParams,

    editingField,
    startEdit,
    saveEdit,

    clearTitle,
    clearArticle,
    clearPrice,

    addParam,
    changeParam,
    deleteParam,

    fillForm,
    resetForm,
  };
}