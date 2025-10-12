import { Text } from "@/components/ui/text";
import { View } from "@rn-primitives/slot";
import { useLocalSearchParams } from "expo-router";

const Dynamic = () => {
  const { id } = useLocalSearchParams();
  return (
    <View className="bg-primary">
      <Text>
        {id}
      </Text>
    </View>
  )
};

export default Dynamic
