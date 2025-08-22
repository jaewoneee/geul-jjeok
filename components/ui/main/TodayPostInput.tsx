import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const TodayPostInput = () => {
  return (
    <ThemedView>
      <ThemedText>오늘의 글쩍</ThemedText>
      <ThemedInput placeholder="당신의 오늘 하루, 한 줄로 표현한다면?" />
    </ThemedView>
  );
};
export default TodayPostInput;
