import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import { User, SignIn } from "./interfaces";
import {
  resetPassword,
  signInUser,
  verifyUser,
  fetchUserData,
} from "../app/services/rest";
// ***NEW GAME EDIT
const initialState = {
  user: {
    token: "",
    id: 0,
    email: "",
    avatar_url:
      "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png",
    username: "none",
    last_seen: null,
    user_id: 0,
    connection_count_sender: 0,
    connection_count_acceptor: 0,
    connections: [],
    show_tasks: true,
    input_device_id: "",
    output_device_id: "",
    created_at: null,
    updated_at: null,
    error: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<any>) {
      state.user = payload;
    },
    updateUserAvatarUrl(state, { payload }: PayloadAction<string | undefined>) {
      state.user.avatar_url = payload;
    },
    updateUserName(state, { payload }: PayloadAction<string | undefined>) {
      state.user.username = payload;
    },
    setUserError(state, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const { setUser, setUserError, updateUserAvatarUrl, updateUserName } =
  userSlice.actions;
export default userSlice.reducer;

// THUNK / EPIC

// THUNK: Creating User
export const createUserInState =
  (
    email: string,
    vKey: string,
    name: string,
    password: string,
    steam_id: string = ""
  ): AppThunk =>
  async (dispatch) => {
    try {
      let response: any;
      response = await verifyUser(email, vKey, name, password, steam_id);
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK2: Sign In User
export const signInUserThunk =
  (signin: any, isAppleSignIn = false): any =>
  async (dispatch: any) => {
    try {
      let response: any;
      if (isAppleSignIn) {
        response = await signInUser(
          {
            appleUserId: signin.appleUserId,
          },
          true
        );
      } else {
        response = await signInUser(
          {
            email: signin.email,
            password: signin.password,
          },
          false
        );
      }
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK3: Update User
export const updateUserThunk =
  (userId: number): any =>
  async (dispatch) => {
    try {
      let response: any;
      response = await fetchUserData(userId);
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK4: Logout User
export const logoutUser =
  (userId: number): any =>
  async (dispatch) => {
    try {
      if (userId !== 0) {
        dispatch(
          setUser({
            token: "",
            id: 0,
            email: "",
            avatar_url:
              "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png",
            username: "none",
            last_seen: undefined,
            user_id: 0,
            connection_count_sender: 0,
            connection_count_acceptor: 0,
            connections: [],
            show_tasks: true,
            input_device_id: "",
            output_device_id: "",
            created_at: undefined,
            updated_at: undefined,
            error: false,
          })
        );
      }
      return { success: "true" };
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK5: Resetting Password For User
export const resetPasswordInState =
  (email: string, vKey: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      let response: any;
      response = await resetPassword(email, vKey, password);
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };
