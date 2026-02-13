import 'react-native-get-random-values'; // <--- ADD THIS LINE FIRST
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { v4 as uuidv4 } from 'uuid';
import api from '../services/api'; // Ensure you have created this file in services/api.js

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [cart, setCart] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const cameraRef = useRef<CameraView>(null);


  useEffect(() => {
    const sess = uuidv4();
    setSessionId(sess);


    api.getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error loading products", err));


    const interval = setInterval(() => fetchCart(sess), 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCart = async (id: string) => {
    try {
      const res = await api.getCart(id);
      setCart(res.data);
    } catch (e) {

    }
  };

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        if (photo?.base64) {
            analyzeImage(photo.base64);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const analyzeImage = async (base64: string) => {
    try {

      const imgData = "data:image/jpeg;base64," + base64;
      
      const res = await api.scanItem(imgData);
      const predName = res.data.prediction;

      if (predName !== "Unsure") {
        const product = products.find(p => p.name.toLowerCase().includes(predName.toLowerCase()));
        
        if (product) {
          Alert.alert("Found It!", `Add ${product.name} for $${product.price}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Add to Cart", onPress: () => addToCart(product.sku) }
          ]);
        } else {
          Alert.alert("AI Says:", `It looks like a ${predName}, but we don't sell that.`);
        }
      } else {
        Alert.alert("AI Unsure", "Could not identify object. Try getting closer.");
      }
    } catch (err) {
      Alert.alert("Connection Error", "Could not reach the server. Check your IP.");
    }
  };

  const addToCart = async (sku: string) => {
    try {
        await api.addToCart(sessionId, sku, 1);
        fetchCart(sessionId);
    } catch (error) {
        Alert.alert("Error", "Could not add to cart.");
    }
  };

  const handleCheckout = async () => {
    try {
      await api.checkout(sessionId);
      Alert.alert("Success", "Order Placed!");
      setCart(null);
    } catch (err) {
      Alert.alert("Failed", "Checkout failed.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <Text style={styles.captureText}>📸 SCAN</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      <View style={styles.cartContainer}>
        <Text style={styles.header}>🛒 Smart Cart</Text>
        
        <ScrollView style={styles.cartList}>
          {cart && cart.items && cart.items.length > 0 ? (
            cart.items.map((item: any, idx: number) => (
              <View key={idx} style={styles.cartItem}>
                <Text style={styles.itemText}>{item.productName} (x{item.quantity})</Text>
                <Text style={styles.priceText}>${(item.unitPrice * item.quantity).toFixed(2)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Your cart is empty. Scan something!</Text>
          )}
        </ScrollView>

        {cart && cart.items && cart.items.length > 0 && (
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.btnText}>
              Checkout (${cart.grandTotal ? cart.grandTotal.toFixed(2) : "0.00"})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  message: { textAlign: 'center', paddingBottom: 10, color: 'white' },
  cameraContainer: { flex: 3 }, 
  camera: { flex: 1 },
  buttonContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20, alignItems: 'center' },
  captureBtn: { backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 50 },
  captureText: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  
  cartContainer: { flex: 2, backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  cartList: { marginBottom: 10 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  itemText: { fontSize: 16, color: '#333' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#28a745' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999', fontStyle: 'italic' },
  
  checkoutBtn: { backgroundColor: '#28a745', padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  permissionBtn: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5 }
});