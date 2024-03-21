export const validateUsername = async (username: string): Promise<string> => {
  if (!username || username.length < 3) return "Username is too short!";
  return "success";
};

export const validateEmail = async (email: string): Promise<string> => {
  // Regular expression for basic email validation
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passed = regex.test(String(email).toLowerCase());
  return passed ? "success" : "Not a valid email!";
};
