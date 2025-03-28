// src/redux/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UserState {
  users: User[];
  total_pages: number;
  current_page: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  total_pages: 1,
  current_page: 1,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, userData }: { id: number; userData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `https://reqres.in/api/users/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to delete user");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total_pages = action.payload.total_pages;
        state.current_page = action.payload.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
