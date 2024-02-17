import { useState } from "react";
import { Minus } from "@tamagui/lucide-icons";
import { Button, Input, Paragraph, XStack } from "tamagui";

interface trackProps {
  label: string;
  value: number;
  onClick: any;
  deleteTrack: any;
}

function Track({ label, value, onClick, deleteTrack }: trackProps) {
  const [isDeleteView, setDeleteView] = useState(false);
  return (
    <XStack
      justifyContent="space-between"
      marginBottom={5}
      onLongPress={() => setDeleteView(true)}
    >
      <Paragraph
        overflow="scroll"
        height={50}
        maxWidth={300}
      >
        {label}
      </Paragraph>
      <Input
        value={String(value)}
        textAlign="center"
        inputMode="numeric"
        onChangeText={onClick}
        width={60}
      />
      {isDeleteView ? (
        <Button onPressOut={deleteTrack}>
          <Minus size={10} />{" "}
        </Button>
      ) : null}
    </XStack>
  );
}

export default Track;
