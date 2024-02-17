// @ts-nocheck
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Github, Twitter } from "@tamagui/lucide-icons";
import { Link, useRouter } from "expo-router";
import {
  Button,
  H1,
  ListItem,
  Paragraph,
  Separator,
  YGroup,
  YStack
} from "tamagui";

import { MySafeAreaView } from "../components/MySafeAreaView";
import { MyStack } from "../components/MyStack";
import NewTrackModal from "../components/NewTrackModal";
import Track from "../components/track";
import { getJSONData, storeJSONData } from "../utils/asyncStorage";

const today = new Date();
const year = today.getFullYear();
const mon = today.getMonth() + 1;
const day = today.getDate();
const date = day + "-" + mon + "-" + year;

export default function Home() {
  console.log("rerender");

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

  function onClick(index) {
    return (value: number) => {
      const deepCopyData = JSON.parse(JSON.stringify(data));
      deepCopyData[index].value = value;
      setData(deepCopyData);
      storeJSONData(
        date,
        data.reduce((obj, item) => ((obj[item.title] = item.value), obj), {})
      ).then(console.log("stored data", deepCopyData));
    };
  }

  useEffect(() => {
    getJSONData(date).then((result) => {
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
          <H1 textAlign="center">Welcome to LiTaaa</H1>
          <Paragraph textAlign="center">
            Here&apos;s a basic starter to show navigating from one screen to
            another.
          </Paragraph>
        </YStack>

        <YStack space="$2.5">
          <Button onPress={() => router.push("/graphs")}>
            Go to graphs page
          </Button>
          <NewTrackModal />
        </YStack>

        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <Track
              label={item.title}
              value={item.value}
              onClick={onClick(index)}
            />
          )}
          estimatedItemSize={100}
        />
      </MyStack>
    </MySafeAreaView>
  );
}
