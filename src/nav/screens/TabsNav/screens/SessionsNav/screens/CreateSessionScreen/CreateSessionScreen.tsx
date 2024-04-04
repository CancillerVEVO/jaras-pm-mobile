import { ScrollView, View } from 'react-native';
import { Input } from '@/components/Input';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateSessionSchema,
  useCreateSession,
} from '../../hooks/useCreateSession';
import { z } from 'zod';
import { Products } from './Products';

export function CreateSessionScreen() {
  const mutation = useCreateSession();

  const form = useForm<z.input<typeof CreateSessionSchema>>({
    defaultValues: {
      name: '',
      session_status_id: 1,
      products: [],
    },
    resolver: zodResolver(CreateSessionSchema),
  });

  const { handleSubmit, control } = form;

  const onSubmit = mutation.mutate;

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View
            style={{
              gap: 10,
            }}
          >
            <Input
              label="Ponle un nombre a la sesión"
              value={value}
              onChangeText={onChange}
              placeholder="Nombre de la sesión"
              editable={!mutation.isPending}
            />

            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
          </View>
        )}
        name="name"
      />

      <Products
        controllerProps={{
          control,
          name: 'products',
        }}
      />

      {mutation.isError && (
        <Text style={{ color: 'red' }}>{mutation.error.message}</Text>
      )}

      <Button
        onPress={handleSubmit(onSubmit as any)}
        disabled={mutation.isPending}
      >
        Crear
      </Button>
    </ScrollView>
  );
}
