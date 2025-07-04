import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config/Contant";

const token = () => localStorage.getItem("token") || "";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ page, limit }, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/products`, {
        params: { page, limit },  headers: {
            Authorization: `Bearer ${token()}`,
          },
      });
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData, thunkAPI) => {
    try {
      await axios.post(`${API_URL}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token()}`,
        },
      });
      const { page, limit } = thunkAPI.getState().products.params;
      return thunkAPI.dispatch(fetchProducts({ page, limit }));
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, formData }, thunkAPI) => {
    try {
      await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token()}`,
        },
      });
      const { page, limit } = thunkAPI.getState().products.params;
      return thunkAPI.dispatch(fetchProducts({ page, limit }));
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const { page, limit } = thunkAPI.getState().products.params;
      return thunkAPI.dispatch(fetchProducts({ page, limit }));
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    params: { page: 1, limit: 10 },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload, meta }) => {
        state.items = payload.products;
        state.total = payload.total;
        state.params = meta.arg;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
