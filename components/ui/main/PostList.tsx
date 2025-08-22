import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FlatList, ScrollView } from "react-native";
const data = ["사과", "바나나", "포도"];

const PostItem = ({ item }: { item: string }) => {
  return (
    <ThemedView
      style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
    >
      <ThemedText>{item}</ThemedText>
    </ThemedView>
  );
};

const PostList = () => {
  return (
    <ScrollView>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => <PostItem item={item} />}
      />
    </ScrollView>
  );
};

export default PostList;
