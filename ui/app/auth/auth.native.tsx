import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useDispatch, useSelector } from "react-redux";
import { signInUserThunk } from "../../store/userSlice";
import { router } from "expo-router";
import { useEffect } from "react";
import { RootState } from "../../store/store";

export function Auth({ handleSuccess, handleError, handleCreateAccount }) {
  const dispatch = useDispatch();

  const userState = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    if (userState.id && userState.id > 0) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  const tryAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // Sign in via Supabase Auth.
      if (credential.identityToken && credential.user) {
        const result: any = await dispatch(
          signInUserThunk({ appleUserId: credential.user }, true)
        );

        console.log("response? ", result);
        if (result && result.status === "success") {
          handleSuccess(result);
        } else {
          handleCreateAccount(credential.user);
        }
        // const {
        //   error,
        //   data: { user },
        // } = await supabase.auth.signInWithIdToken({
        //   provider: 'apple',
        //   token: credential.identityToken,
        // })
        // console.log(JSON.stringify({ error, user }, null, 2))
        // if (!error) {
        //   // User is signed in.
        // }
      } else {
        throw new Error("No identityToken.");
      }
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };
  if (Platform.OS === "ios")
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64, marginBottom: 15 }}
        onPress={tryAppleLogin}
      />
    );
  return <>{/* Implement Android Auth options. */}</>;
}
