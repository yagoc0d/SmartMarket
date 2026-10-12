import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProdutoItem({
  produto,
  onEditar,
  onDeletar,
  onToggleComprado,
}) {
  const total = produto.quantidade * produto.precoUnitario;

  return (
    <View style={[styles.card, produto.comprado && styles.cardComprado]}>
      <TouchableOpacity
        style={styles.checkArea}
        onPress={() => onToggleComprado(produto.id, produto.comprado)}
      >
        <Text style={styles.check}>{produto.comprado ? "✅" : "⬜"}</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={[styles.nome, produto.comprado && styles.nomeComprado]}>
          {produto.nomeProduto}
        </Text>
        <Text style={styles.detalhe}>
          {produto.quantidade}x R$ {produto.precoUnitario.toFixed(2)}
        </Text>
      </View>

      <View style={styles.acoes}>
        <Text style={styles.total}>R$ {total.toFixed(2)}</Text>
        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => onEditar(produto)}
          >
            <Text style={styles.botaoTexto}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoDeletar}
            onPress={() => onDeletar(produto.id)}
          >
            <Text style={styles.botaoTexto}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardComprado: {
    backgroundColor: "#f0fff4",
    opacity: 0.8,
  },
  checkArea: { marginRight: 10 },
  check: { fontSize: 22 },
  info: { flex: 1 },
  nome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a202c",
  },
  nomeComprado: {
    textDecorationLine: "line-through",
    color: "#a0aec0",
  },
  detalhe: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  acoes: { alignItems: "flex-end" },
  total: {
    fontSize: 15,
    fontWeight: "700",
    color: "#38a169",
    marginBottom: 6,
  },
  botoes: { flexDirection: "row", gap: 8 },
  botaoEditar: {
    backgroundColor: "#ebf8ff",
    padding: 6,
    borderRadius: 8,
  },
  botaoDeletar: {
    backgroundColor: "#fff5f5",
    padding: 6,
    borderRadius: 8,
  },
  botaoTexto: { fontSize: 14 },
});
