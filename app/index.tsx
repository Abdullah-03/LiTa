//@ts-nocheck
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Frown, Laugh, Rss } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, H1, Paragraph, Text, XStack, YStack } from "tamagui";

import { MySafeAreaView } from "../components/MySafeAreaView";
import { MyStack } from "../components/MyStack";
import NewTrackModal from "../components/NewTrackModal";
import Track from "../components/track";
import db from "../utils/db";
import { ResultSet } from "expo-sqlite";

interface resultInterface {
  title: string;
  value: number;
}
[];

// const today = new Date();
// const year = today.getFullYear();
// const mon = today.getMonth() + 1;
// const day = today.getDate();
// const date = day + "-" + mon + "-" + year;

export default function Home() {
  const [mood, setMood] = useState(-1);
  const [firstRun, setFirstRun] = useState(true);

  console.log("rerender");

  function addNewTrack(name: string) {
    // const deepCopyData = JSON.parse(JSON.stringify(data));
    // deepCopyData.push({ title: name, value: 0 });
    // setData(deepCopyData);
    // storeJSONData(
    //   date,
    //   deepCopyData.reduce(
    //     (obj, item) => ((obj[item.title] = item.value), obj),
    //     {}
    //   )
    // ).then(() => console.log("stored data", deepCopyData));
    console.log("store track");
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
    console.log("delete track");

    // const deepCopyData = JSON.parse(JSON.stringify(data));
    // deepCopyData.splice(index, 1);
    // setData(deepCopyData);
    // storeJSONData(
    //   date,
    //   data.reduce((obj, item) => ((obj[item.title] = item.value), obj), {})
    // ).then(() => console.log("stored data", deepCopyData));
  }

  function onClick(index) {
    // return (value: number) => {
    //   const deepCopyData = JSON.parse(JSON.stringify(data));
    //   deepCopyData[index].value = value;
    //   setData(deepCopyData);
    //   storeJSONData(
    //     date,
    //     data.reduce((obj, item) => ((obj[item.title] = item.value), obj), {})
    //   ).then(() => console.log("stored data", deepCopyData));
    // };
  }

  function moodClick(m: number): void {
    // mood === m ? setMood(-1) : setMood(m);
    // storeStringData(date + " mood", String(m));
  }

  useEffect(() => {
    async function get_data() {
      if (firstRun) {
        await db.transactionAsync(async (tx) => {
          await tx
            .executeSqlAsync(
              "CREATE TABLE IF NOT EXISTS track (date TEXT DEFAULT CURRENT_DATE UNIQUE NOT NULL);"
            )
            .catch(() => console.log("track table creation failed"));
        });
        setFirstRun(false);
      }

      let result;
      await db.transactionAsync(async (tx) => {
        result = await tx
          .executeSqlAsync("SELECT * FROM track WHERE date = DATE('now');")
          .then((res) => res.rows)
          .catch(() => console.log("query failed"));
      });

      if (Object.keys(result).length === 0) {
        //no data for today
        await db.transactionAsync(async (tx) => {
          result = await tx
            .executeSqlAsync("SELECT * FROM track LIMIT 1")
            .then((res) => res.rows)
            .catch(() => console.log("query failed"));
        });
        if (Object.keys(result).length === 0) {
          //new user with no prior entries (show default entry)
          setData([
            {
              title: "Track First Thing",
              value: -1
            }
          ]);
        } else {
          // new day with no entries then populate view with users previous entries
          ans = {};
          for (const column in result) {
            ans[column] = -1;
          }
          setData(ans);
        }
      } else {
        //there is tracked data today
        ans = {};
        for (const column in result) {
          ans[column] = -1;
        }
        setData(ans);
      }
    }

    get_data();

    // getJSONData(date).then((result: resultInterface) => {
    //   console.log("useEffect ran", result);

    //   setData(
    //     Object.entries(result).map(([title, value]) => ({ title, value }))
    //   );
    // });
    // getStringData(date + " mood").then((result) => {
    //   result === null ? setMood(-1) : setMood(Number(result));
    //   console.log("use effect ran", result);
    // });
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
