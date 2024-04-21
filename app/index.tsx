//@ts-nocheck
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Frown, Laugh, Baby } from "@tamagui/lucide-icons";
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
  const [mood, setMood] = useState(2);
  const [firstRun, setFirstRun] = useState(true);

  console.log("rerender");

  function addNewTrack(name: string) {
    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(`ALTER TABLE track ADD COLUMN ${name} TEXT;`)
        .then(() => {
          const deepCopyData = JSON.parse(JSON.stringify(data));
          deepCopyData.push({ title: name, value: 0 });
          setData(deepCopyData);
        })
        .catch((e) => console.log("Add new track failed", e));
    });
    console.log("store track");
  }

  const [data, setData] = useState([
    {
      title: "First Item!!!",
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

  function onClick(index: number) {
    return async (value: number) => {
      const deepCopyData = JSON.parse(JSON.stringify(data));
      deepCopyData[index].value = value;
      setData(deepCopyData);
      db.transactionAsync((tx) => {
        tx.executeSqlAsync(
          `INSERT INTO track(${data[index].title}) VALUES ${value}`
        ).catch((e) => console.log(e));
      });
    };
  }

  function moodClick(m: number): void {
    mood === m ? setMood(2) : setMood(m);
    db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync("");
    });
  }

  useEffect(() => {
    async function get_data() {
      // app starts for first time, create track table
      if (firstRun) {
        await db.transactionAsync(async (tx) => {
          await tx
            .executeSqlAsync("DROP TABLE track;")
            .then(() => console.log("deleted"))
            .catch((e) => console.log("delete failed", e));
          await tx
            .executeSqlAsync(
              "CREATE TABLE IF NOT EXISTS track (date TEXT DEFAULT CURRENT_DATE UNIQUE NOT NULL, mood INT);"
            )
            .catch(() => console.log("track table creation failed"));
        });
        setFirstRun(false);
      }

      let result: ResultSet.rows;
      await db.transactionAsync(async (tx) => {
        result = await tx
          .executeSqlAsync("SELECT * FROM track WHERE date = CURRENT_DATE;")
          .then((res) => res.rows)
          .catch((e) => console.log("query failed", e));
      });

      // no data for today
      if (result.length === 0) {
        await db.transactionAsync(async (tx) => {
          result = await tx
            .executeSqlAsync("PRAGMA table_info(track);")
            .then((res) => {
              return res.rows;
            })
            .catch(() => console.log("query failed"));
        });

        //new user with no prior entries (show default entry) (intial table has 2 cols mood and date)
        if (result.length === 2) {
          setData([
            {
              title: "Track First Thing",
              value: -1
            }
          ]);
        }
        // new day with no entries then populate view with users previous entries
        else {
          console.log("new day with no entries");
          console.log(result);

          let ans = [];
          for (const column of result) {
            ans.push({
              title: column.name,
              value: -1
            });
          }
          setData(ans);
        }
      }
      //there is tracked data today
      else {
        ans = {};
        for (const column in result) {
          ans[column] = -1;
        }
        setData(ans);
      }
    }

    get_data();
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
            backgroundColor={"purple"}
          >
            <Button
              //size={40}
              width={"1/4"}
              onPress={() => {
                moodClick(3);
              }}
              marginVertical={"auto"}
              backgroundColor={mood === 3 ? "$blue10" : "black"}
              icon={<Laugh size="$2" />}
            >
              Happy
            </Button>
            <Button
              //size={40}
              width={"1/4"}
              onPress={() => {
                moodClick(2);
              }}
              marginVertical={"auto"}
              backgroundColor={mood === 2 ? "$blue10" : "black"}
              icon={<Baby size="$2" />}
            >
              Neutral
            </Button>
            <Button
              //size={40}
              width={"1/4"}
              onPress={() => {
                moodClick(1);
              }}
              marginVertical={"auto"}
              backgroundColor={mood === 1 ? "$blue10" : "black"}
              icon={<Frown size="$2" />}
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
