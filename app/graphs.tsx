//@ts-nocheck
// import { useEffect, useState } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { FlashList } from "@shopify/flash-list";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
// import LottieView from "lottie-react-native";
// import { Button, H6, Text } from "tamagui";

// import { MyStack } from "../components/MyStack";
// import { getJSONData, getStringData } from "../utils/asyncStorage";

// interface resultInterface {
//   title: string;
//   value: number;
// }
// [];

// const today = new Date();
// const year = today.getFullYear();
// const mon = today.getMonth() + 1;
// const day = today.getDate();
// const date = day + "-" + mon + "-" + year;

// export default function Graphs() {
//   const [data, setData] = useState({ title: "test", value: 1 });
//   const [mood, setMood] = useState(-1);
//   useEffect(() => {
//     getJSONData(date).then((result: resultInterface) => {
//       setData(
//         Object.entries(result).map(([title, value]) => ({ title, value }))
//       );
//       console.log(
//         Object.entries(result).map(([title, value]) => ({ title, value }))
//       );
//     });

//     getStringData(date + " mood").then((result) => {
//       setMood(result);
//       console.log(result);
//     });
//   }, []);

//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [isAnimationTime, setanimationTime] = useState(true);

//   setTimeout(() => setanimationTime(false), 3000);

//   return isAnimationTime ? (
//     <MyStack
//       justifyContent="center"
//       backgroundColor="black"
//     >
//       <LottieView
//         source={require("../assets/Animation - 1708145240968 (1).json")}
//         autoPlay={true}
//         style={{ width: "100%", height: "60%" }}
//         loop
//       />
//       <Text
//         fontSize="$9"
//         textAlign="center"
//       >
//         Generating Graphs
//       </Text>
//     </MyStack>
//   ) : (
//     <MyStack justifyContent="flex-start">
//       <Stack.Screen
//         options={{
//           headerShown: true,
//           headerTitle: `${params.user}'s user page`,
//           headerLeft() {
//             return (
//               <Button
//                 mr="$2.5"
//                 onPress={router.back}
//               >
//                 <MaterialCommunityIcons name="arrow-left" />
//               </Button>
//             );
//           }
//         }}
//       />

//       <H6> Here are you personalized insights.</H6>

//       <FlashList
//         data={data}
//         renderItem={({ item }) => (
//           <Text>{`${item.value > 0 ? "" : "Not doing "}${item.title} made you ${
//             mood === "1" ? "happy 😀" : "sadd"
//           }`}</Text>
//         )}
//         estimatedItemSize={100}
//       />
//     </MyStack>
//   );
// }

import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function App() {
  const barData = [
    { value: 8, label: "Happy" },
    { value: 2, label: "Sad", frontColor: "#177AD5" }
  ];
  return (
    <View>
      <BarChart
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        isAnimated
      />
    </View>
  );
}
