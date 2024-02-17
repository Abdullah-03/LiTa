// @ts-nocheck
// import { useState } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
// import LottieView from "lottie-react-native";
// import { Button, H6, Text } from "tamagui";

// import { MyStack } from "../components/MyStack";
// import SelectDemo from "../components/SelectDemo";
// import SpinnerDemo from "../components/SpinnerDemo";
// import SwitchDemo from "../components/SwitchDemo";

// export default function User() {
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

//       <H6>Some Tamagui components in action.</H6>

//       <SelectDemo />
//       <SpinnerDemo />
//       <SwitchDemo />
//     </MyStack>
//   );
// }

import { View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { CartesianChart, Line } from "victory-native";

export default function MyChart() {
  const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random()
  }));
  const font = useFont(require("../assets/times.ttf"), 12);
  return (
    <View
      style={{
        height: 300,
        backgroundColor: "white",
        alignContent: "center",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        axisOptions={{ font }}
      >
        {/* 👇 render function exposes various data, such as points. */}
        {({ points }) => (
          // 👇 and we'll use the Line component to render a line path.
          <Line
            points={points.highTmp}
            color="red"
            strokeWidth={3}
          />
        )}
      </CartesianChart>
    </View>
  );
}
