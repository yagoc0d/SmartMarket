import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.emoji}>🛒</Text>
        <Text style={styles.titulo}>SmartMarket</Text>
        <Text style={styles.subtitulo}>Sua lista de compras inteligente</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("RecuperarSenha")}>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.link}>
            Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: "center",
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    color: "#1a202c",
    backgroundColor: "#f7fafc",
  },
  botao: {
    width: "100%",
    backgroundColor: "#38a169",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  botaoTexto: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: "#718096",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  linkBold: {
    color: "#38a169",
    fontWeight: "700",
  },
});
