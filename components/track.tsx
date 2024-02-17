import { Input, Paragraph, XStack } from "tamagui";

interface trackProps {
  label: string;
  value: number;
  onClick: any;
}

function Track({ label, value, onClick }: trackProps) {
  return (
    <XStack
      justifyContent="space-between"
      marginBottom={5}
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
    </XStack>
  );
}

export default Track;
