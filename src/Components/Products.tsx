import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { db } from "@/db";

interface Product {
  id: string;
  name: string;
  price: number;
}

const Products: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  const handleCreateProduct = () => {
    db().transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "Products" (name, price) values (?, ?)`,
        [productName, productPrice],
        (_, { insertId }) => {
          console.log("Product inserted with id", insertId);
        },
        (tx, err): boolean | any => {
          console.log("Error", err);
        }
      );
    });
  };
  const handleFetchProducts = () => {
    db().readTransaction((tx) => {
      tx.executeSql(`SELECT * FROM "Products"`, [], (_, { rows }) => {
        const products: Product[] = [];
        for (let i = 0; i < rows.length; i++) {
          products.push(rows.item(i));
        }
        setProducts(products);
      });
    });
  };

  return (
    <View style={{ flex: 1, padding: 60 }}>
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}
          placeholder="Enter product name"
          value={productName}
          onChangeText={(text) => setProductName(text)}
        />
         <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
          placeholder="Enter product price"
          value={productPrice}
          onChangeText={(text) => setProductPrice(text)}
          keyboardType="numeric"
        />
        <Button title="Create Product" onPress={handleCreateProduct} />
      </View>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Product List
        </Text>
        <Button title="Fetch Products" onPress={handleFetchProducts} />
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Text>Name: {item.name}</Text>
              <Text>Price: ${item.price}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default Products;
