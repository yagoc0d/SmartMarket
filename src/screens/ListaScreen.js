import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProdutoItem from "../components/ProdutoItem";
import { auth, db } from "../config/firebase";

export default function ListaScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nomeProduto, setNomeProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");

  useEffect(() => {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, "produtos"),
      where("uid", "==", uid),
      orderBy("dataAdicao", "desc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProdutos(lista);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  function abrirModal(produto = null) {
    if (produto) {
      setEditando(produto);
      setNomeProduto(produto.nomeProduto);
      setQuantidade(String(produto.quantidade));
      setPrecoUnitario(String(produto.precoUnitario));
    } else {
      setEditando(null);
      setNomeProduto("");
      setQuantidade("");
      setPrecoUnitario("");
    }
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setEditando(null);
    setNomeProduto("");
    setQuantidade("");
    setPrecoUnitario("");
  }

  async function salvarProduto() {
    if (!nomeProduto || !quantidade || !precoUnitario) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const dados = {
      nomeProduto,
      quantidade: Number(quantidade),
      precoUnitario: Number(precoUnitario),
      uid: auth.currentUser.uid,
    };

    try {
      if (editando) {
        await updateDoc(doc(db, "produtos", editando.id), dados);
      } else {
        await addDoc(collection(db, "produtos"), {
          ...dados,
          comprado: false,
          dataAdicao: serverTimestamp(),
        });
      }
      fecharModal();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  }

  async function deletarProduto(id) {
    Alert.alert("Confirmar", "Deseja remover este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "produtos", id));
        },
      },
    ]);
  }

  async function toggleComprado(id, comprado) {
    await updateDoc(doc(db, "produtos", id), { comprado: !comprado });
  }

  const totalGeral = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.precoUnitario,
    0,
  );

  const totalComprados = produtos
    .filter((p) => p.comprado)
    .reduce((acc, p) => acc + p.quantidade * p.precoUnitario, 0);

  const qtdComprados = produtos.filter((p) => p.comprado).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>🛒 Minha Lista</Text>
          <Text style={styles.headerSub}>
            {produtos.length} produto{produtos.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.botaoSair}
          onPress={() => signOut(auth)}
        >
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Card total */}
      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total da lista</Text>
          <Text style={styles.totalValor}>R$ {totalGeral.toFixed(2)}</Text>
        </View>
        {qtdComprados > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalSubLabel}>
              ✅ {qtdComprados} comprado{qtdComprados !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.totalSubValor}>
              R$ {totalComprados.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#38a169"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProdutoItem
              produto={item}
              onEditar={abrirModal}
              onDeletar={deletarProduto}
              onToggleComprado={toggleComprado}
            />
          )}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioEmoji}>🛍️</Text>
              <Text style={styles.vazioTexto}>Lista vazia!</Text>
              <Text style={styles.vazioSub}>
                Toque no + para adicionar produtos
              </Text>
            </View>
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />
      )}

      {/* Botão adicionar */}
      <TouchableOpacity style={styles.fab} onPress={() => abrirModal()}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>
              {editando ? "Editar Produto" : "Novo Produto"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              placeholderTextColor="#999"
              value={nomeProduto}
              onChangeText={setNomeProduto}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor="#999"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Preço unitário (R$)"
              placeholderTextColor="#999"
              value={precoUnitario}
              onChangeText={setPrecoUnitario}
              keyboardType="decimal-pad"
            />

            {nomeProduto && quantidade && precoUnitario && (
              <Text style={styles.previewTotal}>
                Total: R${" "}
                {(Number(quantidade) * Number(precoUnitario)).toFixed(2)}
              </Text>
            )}

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={fecharModal}
              >
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={salvarProduto}
              >
                <Text style={styles.botaoSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  header: {
    backgroundColor: "#38a169",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitulo: { color: "white", fontSize: 22, fontWeight: "700" },
  headerSub: { color: "#c6f6d5", fontSize: 13, marginTop: 2 },
  botaoSair: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  botaoSairTexto: { color: "white", fontWeight: "600", fontSize: 13 },
  totalCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  totalLabel: { fontSize: 15, color: "#4a5568", fontWeight: "600" },
  totalValor: { fontSize: 22, fontWeight: "700", color: "#38a169" },
  totalSubLabel: { fontSize: 13, color: "#68d391" },
  totalSubValor: { fontSize: 15, fontWeight: "600", color: "#68d391" },
  vazio: { alignItems: "center", marginTop: 60 },
  vazioEmoji: { fontSize: 60, marginBottom: 12 },
  vazioTexto: { fontSize: 18, fontWeight: "700", color: "#4a5568" },
  vazioSub: { fontSize: 13, color: "#a0aec0", marginTop: 4 },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    backgroundColor: "#38a169",
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabTexto: { color: "white", fontSize: 32, fontWeight: "300", marginTop: -2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
    color: "#1a202c",
    backgroundColor: "#f7fafc",
  },
  previewTotal: {
    textAlign: "center",
    color: "#38a169",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  modalBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  botaoCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  botaoCancelarTexto: { color: "#718096", fontWeight: "600" },
  botaoSalvar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#38a169",
    alignItems: "center",
  },
  botaoSalvarTexto: { color: "white", fontWeight: "700" },
});
