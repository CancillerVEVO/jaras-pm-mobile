import { TouchableOpacity, View } from 'react-native';
import { SessionSummary } from '../../hooks/useSessions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from '@/components/Text';

const statuses = ['Editable', 'Activa', 'Finalizada'];

export function Item({ item }: { item: SessionSummary }) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EditSessionScreen', { id: item.id });
      }}
    >
      <View
        style={{
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>{item.name}</Text>
          <Text>{statuses[item.session_status_id - 1]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
