import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, TouchableOpacity } from "react-native";
import { useProductCategories } from "../hooks/useProductCategories";
import { CategorySummary, useCategories } from "../hooks/useCategories";
import { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "@/components/Button";
import { useUpdateProductCategories } from "../hooks/useUpdateProductrCategories";

export function ProductCategoryScreen({ route }: StackScreenProps<any>) {
  const id = route.params?.id as number;

  const getProductCategoriesQuery = useProductCategories(id);
  const getCategoriesQuery = useCategories();

  const categories = getCategoriesQuery.data;
  const productCategories = getProductCategoriesQuery.data;

  const updateProductCategoriesMutation = useUpdateProductCategories();

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    if (productCategories) {
      setSelectedCategories(productCategories.map((pc) => pc.category_id));
    }
  }, [productCategories]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const saveCategories = () => {
    updateProductCategoriesMutation.mutate(
      { productId: id, categoryIds: selectedCategories },
      {
        onSuccess: () => {
          console.log("Categories updated");
        },
        onError: (error) => {
          console.error('Error updating categories:', error);
          console.log("Error updating categories");
        },
      }
    );
  };

  return (
    <View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: CategorySummary }) => (
          <TouchableOpacity onPress={() => toggleCategory(item.id)}>
            <View
              style={{
                padding: 10,
                backgroundColor: selectedCategories.includes(item.id)
                  ? "lightgreen"
                  : "white",
              }}
            >
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Button
        onPress={saveCategories}
      >
        Guardar
      </Button>

      {
        updateProductCategoriesMutation.isError && (
          <Text style={{ color: "red" }}>{updateProductCategoriesMutation.error.message}</Text>
        )
      }

      {
        updateProductCategoriesMutation.isSuccess && (
          <Text style={{ color: "green" }}>Categorías actualizadas</Text>
        )
      }
    </View>
  );
}
