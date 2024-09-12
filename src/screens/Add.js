import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { database, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const Add = ({ navigation }) => {
    const [producto, setProducto] = useState({
        nombre: '',
        precio: 0,
        vendido: false,
        creado: new Date(),
        imagen: ''
    });

    const goToHome = () => {
        navigation.navigate('Home');
    };

    const openGalery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [8, 8],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                setProducto({
                    ...producto,
                    imagen: result.assets[0].uri
                });
                console.log('Imagen seleccionada:', result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error al abrir la galería', error);
        }
    };

    const agregarProducto = async () => {
        try {
            let imageUrl = null;

            if (producto.imagen) {
                console.log('Subiendo imagen a Firebase Storage...');
                const imageRef = ref(storage, `images/${Date.now()}-${producto.nombre}`);

                const response = await fetch(producto.imagen);
                const blob = await response.blob();

                console.log('Antes del uploadBytes');
                const snapshot = await uploadBytes(imageRef, blob);
                console.log('Snapshot después del uploadBytes:', snapshot);

                imageUrl = await getDownloadURL(snapshot.ref);
                console.log("URL de la imagen:", imageUrl);
            }

            console.log('Datos del producto:', {...producto, imagen: imageUrl});
            await addDoc(collection(database, 'productos'), {...producto, imagen: imageUrl});
            console.log('Se guardó la colección');

            Alert.alert('Producto agregado', 'El producto se agregó correctamente', [
                { text: 'Ok', onPress: goToHome },
            ]);

            goToHome();
        } catch (error) {
            console.error('Error al agregar el producto', error);
            Alert.alert('Error', 'Ocurrió un error al agregar el producto. Por favor, intenta nuevamente.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar producto</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setProducto({ ...producto, nombre: text })}
                    value={producto.nombre}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Precio:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setProducto({ ...producto, precio: parseFloat(text) })}
                    value={producto.precio}
                    keyboardType='numeric'
                />
            </View>
            <Text style={styles.label}>Imagen:</Text>
            <TouchableOpacity onPress={openGalery} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {producto.imagen ? <Image source={{ uri: producto.imagen }} style={styles.imagePreview} /> : null}

            <TouchableOpacity style={styles.button} onPress={agregarProducto}>
                <Text style={styles.buttonText}>Agregar producto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={goToHome}>
                <Text style={styles.buttonText}>Volver a home</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Add;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ff6347',
    },
    input: {
        height: 40,
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 8,
        backgroundColor: '#333',
        color: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        width: '100%'
    },
    imagePicker: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    imagePickerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#ff6347',
    },
    inputContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#2a2a2a',
        marginBottom: 16,
        borderRadius: 4,
    },
});
