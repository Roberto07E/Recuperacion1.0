import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { getAuth, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Home = ({ navigation }) => {
    const [currentName, setCurrentName] = useState('');
    const [newName, setNewName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        // Cargar el nombre del usuario al montar el componente
        if (user) {
            setCurrentName(user.displayName || '');
        }
    }, [user]);

    const reauthenticate = (currentPassword) => {
        if (!user || !currentPassword) {
            return Promise.reject(new Error('Contraseña no proporcionada.'));
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        return reauthenticateWithCredential(user, credential);
    };

    const handleUpdateName = () => {
        if (!newName || !currentPassword) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        if (newName === currentName) {
            Alert.alert('Error', 'El nuevo nombre no puede ser el mismo que el nombre actual.');
            return;
        }

        reauthenticate(currentPassword)
            .then(() => {
                return updateProfile(user, { displayName: newName });
            })
            .then(() => {
                Alert.alert('Éxito', 'Nombre actualizado con éxito.');
                setCurrentName(newName);
                setNewName('');
                setCurrentPassword('');
            })
            .catch((error) => {
                let errorMessage = 'Error desconocido';
                if (error.code === 'auth/requires-recent-login') {
                    errorMessage = 'Debes volver a iniciar sesión para actualizar el nombre.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'La contraseña es incorrecta.';
                }
                Alert.alert('Error', `No se pudo actualizar el nombre: ${errorMessage}`);
                console.log(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actualizar Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre actual"
                value={currentName}
                editable={false} // El nombre actual no se puede editar
                placeholderTextColor="#bbb"
            />
            <TextInput
                style={styles.input}
                placeholder="Nuevo nombre"
                value={newName}
                onChangeText={setNewName}
                placeholderTextColor="#bbb"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña actual"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholderTextColor="#bbb"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateName}
            >
                <Text style={styles.buttonText}>Actualizar Nombre</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ff6347',
        marginBottom: 20,
    },
    input: {
        height: 45,
        backgroundColor: '#333333',
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderColor: '#444444',
        borderWidth: 1,
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        marginHorizontal: 50,
        paddingVertical: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Home;
