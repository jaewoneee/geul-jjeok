import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FlatList, ScrollView } from "react-native";

type PostType = { id: string; post: string };
const data = [{ id: "123", post: "사과" }];

const PostItem = ({ item }: { item: PostType }) => {
  return (
    <ThemedView
      style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
    >
      <ThemedText>{item.post}</ThemedText>
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
