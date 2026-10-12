import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebase";

export default function RecuperarSenhaScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRecuperar() {
    if (!email) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "E-mail enviado!",
        "Verifique sua caixa de entrada para redefinir a senha.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      Alert.alert("Erro", "E-mail não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.titulo}>Recuperar Senha</Text>
        <Text style={styles.subtitulo}>
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={handleRecuperar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Enviar link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>← Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
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
    marginBottom: 16,
  },
  botaoTexto: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: "#38a169",
    fontSize: 13,
    fontWeight: "600",
  },
});
