import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

// User interface
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// API Response interface
interface UserApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

// State interface
interface UserState {
  users: User[];
  total_pages: number;
  current_page: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  total_pages: 1,
  current_page: 1,
  loading: false,
  error: null,
};

// Fetch Users Thunk
export const fetchUsers = createAsyncThunk<
  UserApiResponse,
  number | undefined,
  { rejectValue: string }
>("users/fetchUsers", async (page = 1, thunkAPI) => {
  try {
    const response: AxiosResponse<UserApiResponse> = await axios.get(
      `https://reqres.in/api/users?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue("Failed to fetch users");
  }
});

// Update User Thunk
export const updateUser = createAsyncThunk<
  User,
  { id: number; userData: Partial<User> },
  { rejectValue: string }
>("users/updateUser", async ({ id, userData }, thunkAPI) => {
  try {
    await axios.put(`https://reqres.in/api/users/${id}`, userData);

    // Construct the full updated user object
    const state = thunkAPI.getState() as { users: UserState };
    const existingUser = state.users.users.find((user) => user.id === id);

    if (!existingUser) {
      throw new Error("User not found in state");
    }

    return {
      id,
      email: userData.email ?? existingUser.email,
      first_name: userData.first_name ?? existingUser.first_name,
      last_name: userData.last_name ?? existingUser.last_name,
      avatar: existingUser.avatar, // Preserve existing avatar
    } as User;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue("Failed to update user");
  }
});

// Delete User Thunk
export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("users/deleteUser", async (id, thunkAPI) => {
  try {
    await axios.delete(`https://reqres.in/api/users/${id}`);
    return id;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue("Failed to delete user");
  }
});

// User Slice
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
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserApiResponse>) => {
          state.loading = false;
          state.users = action.payload.data;
          state.total_pages = action.payload.total_pages;
          state.current_page = action.payload.page;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
