//@ts-nocheck
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Frown, Laugh } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, H1, Paragraph, Text, XStack, YStack } from "tamagui";

import { MySafeAreaView } from "../components/MySafeAreaView";
import { MyStack } from "../components/MyStack";
import NewTrackModal from "../components/NewTrackModal";
import Track from "../components/track";
import {
  getJSONData,
  getStringData,
  storeJSONData,
  storeStringData
} from "../utils/asyncStorage";

interface resultInterface {
  title: string;
  value: number;
}
[];

const today = new Date();
const year = today.getFullYear();
const mon = today.getMonth() + 1;
const day = today.getDate();
const date = day + "-" + mon + "-" + year;

export default function Home() {
  const [mood, setMood] = useState(-1);

  console.log("rerender");

  function addNewTrack(name: string) {
    const deepCopyData = JSON.parse(JSON.stringify(data));
    deepCopyData.push({ title: name, value: 0 });
    setData(deepCopyData);
    storeJSONData(
      date,
      deepCopyData.reduce(
        (obj, item) => ((obj[item.title] = item.value), obj),
        {}
      )
    ).then(() => console.log("stored data", deepCopyData));
  }

  const [data, setData] = useState([
    {
      title: "First Item!!!",
      value: 1
    },
    {
      title: "Second Item",
      value: 1
    }
  ]);

  function deleteTrack(index: number) {
    const deepCopyData = JSON.parse(JSON.stringify(data));
    deepCopyData.splice(index, 1);
    setData(deepCopyData);
    storeJSONData(
      date,
      data.reduce((obj, item) => ((obj[item.title] = item.value), obj), {})
    ).then(() => console.log("stored data", deepCopyData));
  }

  function onClick(index) {
    return (value: number) => {
      const deepCopyData = JSON.parse(JSON.stringify(data));
      deepCopyData[index].value = value;
      setData(deepCopyData);
      storeJSONData(
        date,
        data.reduce((obj, item) => ((obj[item.title] = item.value), obj), {})
      ).then(() => console.log("stored data", deepCopyData));
    };
  }

  function moodClick(m: number): void {
    mood === m ? setMood(-1) : setMood(m);
    storeStringData(date + " mood", String(m));
  }

  useEffect(() => {
    getJSONData(date).then((result: resultInterface) => {
      console.log("useEffect ran", result);

      setData(
        Object.entries(result).map(([title, value]) => ({ title, value }))
      );
    });
    getStringData(date + " mood").then((result) => {
      result === null ? setMood(-1) : setMood(Number(result));
      console.log("use effect ran", result);
    });
  }, []);

  const router = useRouter();

  return (
    <MySafeAreaView>
      <MyStack>
        <YStack maxWidth={600}>
          <H1 textAlign="center">Welcome to LiTa</H1>
          <Paragraph textAlign="center">
            A functionally minimal, privacy focused, and completly offline life
            tracking app.
          </Paragraph>
        </YStack>

        <YStack space="$2.5">
          <Button onPress={() => router.push("/graphs")}>
            Generate Graphs
          </Button>
          <NewTrackModal addNewTrack={addNewTrack} />
        </YStack>

        <YStack
          flex={1}
          maxHeight={100}
        >
          <Text
            fontSize={20}
            fontWeight="bold"
            alignSelf="center"
          >
            How are you feeling today?
          </Text>
          <XStack
            flex={1}
            justifyContent="space-around"
            marginTop={10}
          >
            <Button
              size={6}
              onPress={() => {
                moodClick(1);
              }}
              backgroundColor={mood === 1 ? "$blue10" : "black"}
              icon={
                <Laugh
                  size="$2"
                  marginRight={6}
                />
              }
            >
              Happy
            </Button>
            <Button
              size={6}
              onPress={() => {
                moodClick(0);
              }}
              backgroundColor={mood === 0 ? "$blue10" : "black"}
              icon={
                <Frown
                  size="$2"
                  marginRight={6}
                />
              }
            >
              Sad
            </Button>
          </XStack>
        </YStack>

        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <Track
              label={item.title}
              value={item.value}
              onClick={onClick(index)}
              deleteTrack={() => deleteTrack(index)}
            />
          )}
          estimatedItemSize={100}
        />
      </MyStack>
    </MySafeAreaView>
  );
}
