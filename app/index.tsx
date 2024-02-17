//@ts-nocheck
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { Button, H1, Paragraph, YStack } from "tamagui";

import { MySafeAreaView } from "../components/MySafeAreaView";
import { MyStack } from "../components/MyStack";
import NewTrackModal from "../components/NewTrackModal";
import Track from "../components/track";
import { getJSONData, storeJSONData } from "../utils/asyncStorage";

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
  console.log("rerender");

  function addNewTrack(name: string) {
    const deepCopyData = JSON.parse(JSON.stringify(data));
    deepCopyData.push({ title: name, value: 0 });
    setData(deepCopyData);
    storeJSONData(
      date,
      data.reduce((obj, item) => ((obj[item.title] = item.value), obj), {})
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

  useEffect(() => {
    getJSONData(date).then((result: resultInterface) => {
      console.log("useEffect ran", result);

      setData(
        Object.entries(result).map(([title, value]) => ({ title, value }))
      );
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
