import { Text } from '@/components/Text';
import { View, TextInput, StyleSheet } from 'react-native';
import { useConfig } from './hooks/useSettings';
import { Button } from '@/components/Button';
export function SettingsScreen() {
  const query = useConfig();
  const data = query.data ?? [];

  const settings = data[0];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Sheet URL:</Text>
        <TextInput
          style={styles.input}
          value={settings?.sheet_url ?? ''}
          onChangeText={(text) => {
            // Puedes manejar el cambio aquí si lo necesitas
          }}
          placeholder="Ingrese la URL de la hoja"
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.description}>
          Esta es la hoja de cálculo donde se guardarán las ventas. Hay 2 puntos
          que tener en cuenta:
        </Text>
        <Text style={styles.point}>{'\u2022 '} Que la hoja exista.</Text>
        <Text style={styles.point}>
          {'\u2022 '} Que pueda ser accedida públicamente.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            onPress={() => {
              // Agrega aquí la lógica para guardar la configuración
            }}
          >
            Guardar
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  description: {
    marginBottom: 10,
    textAlign: 'center',
  },
  point: {
    marginLeft: 20, // Indentación de la viñeta
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderColor: '#007bff', // Color azul para el borde
    borderWidth: 1, // Ancho del borde
    borderRadius: 5, // Bordes redondeados
    backgroundColor: 'transparent', // Fondo transparente
    overflow: 'hidden', // Asegurar que el botón no se desborde
  },
});
