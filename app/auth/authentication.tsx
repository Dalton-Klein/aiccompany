import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Auth } from "./auth.native";
import { validateEmail, validateUsername } from "../services/auth-services";
import { createUser, uploadAvatarCloud, verifyUser } from "../services/rest";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { router } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

WebBrowser.maybeCompleteAuthSession();

const AuthenticationForm = () => {
  const dispatch = useDispatch();
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const [hasSignInError, sethasSignInError] = useState(false);
  const [signupError, setsignupError] = useState("");
  const [accessToken, setaccessToken] = useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId:
      "1053731323112-gptakuvho0ugstuanjskff0eebl95t4v.apps.googleusercontent.com",
    iosClientId:
      "1053731323112-v4iot9bd003v1bsotriki0qar4n2hpl5.apps.googleusercontent.com",
    androidClientId:
      "1053731323112-0hf213cjgsusebp007pn4f6iu7bak0jc.apps.googleusercontent.com",
  });
  const [profileImage, setprofileImage] = useState(null);
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [appleId, setappleId] = useState("");
  const [isUsernameFocused, setisUsernameFocused] = useState(false);
  const [isEmailFocused, setisEmailFocused] = useState(false);
  const [currentMenu, setcurrentMenu] = useState("signin");

  useEffect(() => {
    setcurrentMenu("signin");
  }, [routeName]);
  useEffect(() => {
    if (response?.type === "success") {
      // setaccessToken(response.authentication.accessToken);
      // accessToken && handleGoogleSignIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, accessToken]);

  const handleEmailSignIn = () => {};

  // const handleGoogleSignIn = async () => {
  //   let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   const useInfo = await response.json();
  //   console.log("google result: ", useInfo);
  // };

  const openAppleSignUp = (appleUserId: string) => {
    setappleId(appleUserId);
    setcurrentMenu("apple-signup");
  };

  const handleCancelSignUp = () => {
    setcurrentMenu("signin");
  };

  const validateAppleSignUpCredentials = async (userTEmailF: boolean) => {
    let hasError = false;
    if (userTEmailF) {
      const userNameValidation = await validateUsername(username);
      if (userNameValidation !== "success") {
        setsignupError(userNameValidation);
        hasError = true;
      }
    } else {
      const emailValidation = await validateEmail(email);
      if (emailValidation !== "success") {
        setsignupError(emailValidation);
        hasError = true;
      }
    }
    if (!hasError) {
      setsignupError("");
    }
  };

  const handleAppleSignUp = async () => {
    if (signupError === "") {
      const result = await createUser({ username, email, appleId });
      if (!result.error) {
        const verifyResult = await verifyUser(
          email,
          "apple",
          username,
          "apple",
          appleId,
          profileImage ? profileImage : ""
        );
        if (verifyResult.error) {
          setsignupError(verifyResult.error);
        } else {
          dispatch(setUser(verifyResult.data));
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.navigate("dashboard");
        }
      }
    }
  };

  const handleSignIn = async () => {
    setcurrentMenu("");
    router.navigate("dashboard");
  };

  const handlePickAvatar = async () => {
    // Requesting permission to access the camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launching the image picker
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Optional: You can force the crop aspect ratio to be square
      quality: 1,
    });

    if (!result.cancelled) {
      const uploadResult = await uploadAvatarCloud(result.assets[0].uri);
      // // Assuming you have a function to handle the upload of the image URL to your server or backend
      setprofileImage(uploadResult);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.masterContainer}>
          <Image
            src={
              "https://res.cloudinary.com/kultured-dev/image/upload/v1711642224/AccompanyMeLogov1-Large-color_jdcz0n.png"
            }
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.titleText}>Accompany Me</Text>

          <Modal
            animationType="slide"
            transparent={true}
            visible={currentMenu === "signin"}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* <TextInput
              style={[
                styles.textInput,
                isUsernameFocused && styles.focusedInput,
              ]}
              placeholder={"Username or Email"}
              onChangeText={(value) => {
                setusername(value);
              }}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
            ></TextInput>
            <TextInput
              style={styles.textInput}
              placeholder={"Password"}
              onChangeText={(value) => {
                setpassword(value);
              }}
              secureTextEntry={true}
            ></TextInput> */}
                <View style={styles.modalConfirmContainer}>
                  {/* <BasicBtn
                iconUrl={<></>}
                handlePress={handleEmailSignIn}
                buttonText={"Sign In"}
              />
              <Text style={styles.seperatorText}>or</Text>
              <BasicBtn
                iconUrl={<></>}
                handlePress={() => {
                  promptAsync();
                }}
                buttonText={"Sign In With Google"}
              /> */}
                  <Auth
                    handleSuccess={() => {
                      handleSignIn();
                    }}
                    handleError={() => {
                      sethasSignInError(true);
                    }}
                    handleCreateAccount={openAppleSignUp}
                  />
                  {hasSignInError ? (
                    <Text style={styles.errorText}>
                      There was a problem signing you in.
                    </Text>
                  ) : (
                    <></>
                  )}

                  {/* <TouchableOpacity style={styles.signUpButton}>
                <Text>Don't have an account? Create one</Text>
              </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </Modal>
          {/* apple account creation */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={currentMenu === "apple-signup"}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.imagePickerBox}>
                  <Text style={styles.imagePickerText}>Profile Photo</Text>
                  {profileImage ? (
                    <TouchableOpacity
                      style={styles.avatarBg}
                      onPress={handlePickAvatar}
                    >
                      <Image src={profileImage} style={styles.profileImg} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.dynamicAvatarBg}
                      onPress={handlePickAvatar}
                    >
                      <FontAwesome
                        name="user-o"
                        size={36}
                        color={THEME.COLORS.lighter}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[
                    styles.textInput,
                    isUsernameFocused && styles.focusedInput,
                  ]}
                  placeholder={"Username"}
                  placeholderTextColor="grey"
                  onChangeText={(value) => {
                    setusername(value);
                    validateAppleSignUpCredentials(true);
                  }}
                  onFocus={() => setisUsernameFocused(true)}
                  onBlur={() => setisUsernameFocused(false)}
                ></TextInput>
                <TextInput
                  style={[
                    styles.textInput,
                    isEmailFocused && styles.focusedInput,
                  ]}
                  placeholder={"Email"}
                  placeholderTextColor="grey"
                  onChangeText={(value) => {
                    setemail(value);
                    validateAppleSignUpCredentials(false);
                  }}
                  onFocus={() => setisEmailFocused(true)}
                  onBlur={() => setisEmailFocused(false)}
                ></TextInput>
                <Text>{signupError !== "" ? signupError : ""}</Text>
                <View style={styles.modalConfirmContainer}>
                  <BasicBtn
                    iconUrl={<></>}
                    handlePress={handleCancelSignUp}
                    buttonText={"Cancel"}
                    isCancel={true}
                  />
                  <BasicBtn
                    iconUrl={<></>}
                    handlePress={handleAppleSignUp}
                    buttonText={"Create Account via Apple"}
                    isCancel={false}
                  />
                </View>
              </View>
            </View>
          </Modal>
          {/* email signup */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={currentMenu === "email-signup"}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={[
                    styles.textInput,
                    isUsernameFocused && styles.focusedInput,
                  ]}
                  placeholder={"Username"}
                  onChangeText={(value) => {
                    setusername(value);
                  }}
                  onFocus={() => setisUsernameFocused(true)}
                  onBlur={() => setisUsernameFocused(false)}
                ></TextInput>
                <TextInput
                  style={[
                    styles.textInput,
                    isEmailFocused && styles.focusedInput,
                  ]}
                  placeholder={"Email"}
                  onChangeText={(value) => {
                    setusername(value);
                  }}
                  onFocus={() => setisEmailFocused(true)}
                  onBlur={() => setisEmailFocused(false)}
                ></TextInput>
                <TextInput
                  style={styles.textInput}
                  placeholder={"Password"}
                  onChangeText={(value) => {
                    setpassword(value);
                  }}
                  secureTextEntry={true}
                ></TextInput>
                <TextInput
                  style={styles.textInput}
                  placeholder={"Confirm Password"}
                  onChangeText={(value) => {
                    setpassword(value);
                  }}
                  secureTextEntry={true}
                ></TextInput>
                <View style={styles.modalConfirmContainer}>
                  <BasicBtn
                    iconUrl={<></>}
                    handlePress={handleEmailSignIn}
                    buttonText={"Sign In"}
                    isCancel={false}
                  />
                  <Text style={styles.seperatorText}>or</Text>
                  <BasicBtn
                    iconUrl={<></>}
                    handlePress={handleEmailSignIn}
                    buttonText={"Sign In With Google"}
                    isCancel={false}
                  />
                  <TouchableOpacity>
                    <Text>Don't have an account? Create one</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  masterContainer: {
    marginTop: 75,
    alignItems: "center",
  },
  logoImage: {
    width: 150, // Adjust the width and height according to your preference
    height: 150,
  },
  titleText: {
    fontSize: THEME.SIZES.xxLarge,
    textAlign: "center",
    fontWeight: "800",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    marginTop: 150,
    backgroundColor: THEME.COLORS.lighter,
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalGrid: {
    minWidth: "100%",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  btnContainer: {
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    marginBottom: 15,
  },
  imagePickerBox: {
    flexDirection: "row",
    minWidth: "80%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imagePickerText: {
    color: "grey",
    fontWeight: "300",
    fontSize: THEME.SIZES.medium,
    paddingBottom: 15,
  },
  profileImg: {
    maxWidth: 75,
    maxHeight: 75,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    marginBottom: 15,
  },
  avatarBg: {
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicAvatarBg: {
    backgroundColor: THEME.COLORS.neutral,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  dynamicAvatarText: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.fontColor,
  },
  textInput: {
    marginBottom: 15,
    padding: 5,
    borderRadius: THEME.BORDERSIZES.medium,
    borderColor: THEME.COLORS.primary,
    borderWidth: 1,
    minWidth: "100%",
  },
  focusedInput: {
    borderColor: THEME.COLORS.primary,
    borderWidth: 2,
  },
  seperatorText: {
    marginBottom: 15,
  },
  btnContentBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: THEME.BORDERSIZES.large,
  },
  btnImg: {
    borderRadius: THEME.SIZES.small / 1.25,
  },
  btnText: {
    color: THEME.COLORS.lighter,
    marginLeft: 10,
    fontSize: THEME.SIZES.large,
  },
  modalConfirmContainer: {
    minWidth: "100%",
    alignItems: "center",
    minHeight: 150,
    justifyContent: "space-evenly",
    paddingTop: 15,
  },
  signUpButton: {
    marginTop: 15,
  },
  errorText: {
    marginTop: 15,
    color: "red",
  },
});

export default AuthenticationForm;
