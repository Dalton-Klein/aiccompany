import { Redirect } from "expo-router";

const StartPage = () => {
  console.log("huh ");
  return (
    <Redirect href="/dashboard" />
  );
};
export default StartPage;
