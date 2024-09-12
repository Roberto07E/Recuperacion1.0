import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebase-config'; // Asegúrate de que tu archivo de configuración esté correcto
import AppLogo from '../../assets/iconos.png';

// Inicializar Firebase solo una vez
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LogIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogInAccount = () => {
    if (!email || !password) {
        Alert.alert('Error', 'Por favor, completa todos los campos.');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('¡Inicio de sesión exitoso!');
            const user = userCredential.user;
            navigation.navigate('Home', { userEmail: user.email }); // Pasa el email al navegar a Home
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('Error', 'Correo electrónico o contraseña inválidos.');
        });
};

  const goToSignUp = () => {
    navigation.navigate('SingUp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={AppLogo} style={styles.logo} />
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#bbb"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#bbb"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogInAccount}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes una cuenta?{' '}
            <Text style={styles.signUpLink} onPress={goToSignUp}>Regístrate aquí!</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginTop: 10,
  },
  form: {
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
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#cccccc',
  },
  signUpLink: {
    color: '#ff6347',
    textDecorationLine: 'underline',
  },
});
