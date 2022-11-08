import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import {
  Feather,
  Ionicons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskInput, { Masks } from "react-native-mask-input";

export default function Home({ navigation }) {
  const [mostrarValor, setMostrarValor] = useState(true);
  const [abrirModal, setAbrirModal] = useState(false);
  const [desc, setDesc] = useState(null);
  const [valor, setValor] = useState(null);
  const [data, setData] = useState("");
  const [tipo, setTipo] = useState(null);
  const [lista, setLista] = useState([]);
  const [totalReceita, setTotalReceita] = useState(null);
  const [totalDespesa, setTotalDespesa] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Receita", value: "1" },
    { label: "Despesa", value: "2" },
  ]);

  useEffect(() => {
    async function CarregarLista() {
      const listaStorage = await AsyncStorage.getItem("@listaf");
      if (listaStorage) {
        setLista(JSON.parse(listaStorage));
      }
    }
    CarregarLista();
  }, []);

  useEffect(() => {
    async function SalvarLista() {
      await AsyncStorage.setItem("@listaf", JSON.stringify(lista));
    }
    SalvarLista();
    CalcularTotal();
  }, [lista]);

  function inserir() {
    if (desc && valor && data && tipo) {
      setLista((arr) => [
        ...arr,
        {
          id: Math.random(2 * 2),
          desc: desc,
          valor: valor,
          data: data,
          tipo: tipo,
        },
      ]);
      limparInserir();
    } else {
      alert("Preencha todos os campos !!!");
    }
  }

  function limparInserir() {
    setAbrirModal(false);
    setDesc(null);
    setValor(null);
    setData("");
    setTipo(null);
  }

  function CalcularTotal() {
    const Receitas = lista
      .filter((r) => r.tipo === "1")
      .map((item) => Number(item.valor))
      .reduce((a, b) => a + b, 0);
    const Despesas = lista
      .filter((r) => r.tipo === "2")
      .map((item) => Number(item.valor))
      .reduce((a, b) => a + b, 0);
    setTotalDespesa(Despesas.toFixed(2));
    setTotalReceita(Receitas.toFixed(2));
  }

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={false} visible={abrirModal}>
        <View style={styles.viewModal}>
          <TouchableOpacity
            onPress={() => setAbrirModal(false)}
            style={styles.btnAbrirModal}
          >
            <Ionicons name="arrow-back" size={38} color="black" />
          </TouchableOpacity>
          <TextInput
            placeholder="Descrição"
            value={desc}
            onChangeText={setDesc}
            style={styles.input}
          />
          <MaskInput
            style={styles.input}
            mask={Masks.BRL_CURRENCY}
            value={valor}
            onChangeText={(masked) => {
              setValor(masked.replace("R$", "").replace(",", "."));
            }}
          />
          <MaskInput
            style={styles.input}
            mask={Masks.DATE_DDMMYYYY}
            value={data}
            onChangeText={setData}
          />
          <DropDownPicker
            placeholder="Selecione o tipo"
            dropDownContainerStyle={styles.dropCont}
            listParentLabelStyle={styles.listLabeldrop}
            placeholderStyle={styles.placeDrop}
            style={styles.input}
            open={open}
            value={tipo}
            items={items}
            setOpen={setOpen}
            setValue={setTipo}
            setItems={setItems}
          />
          <TouchableOpacity onPress={inserir} style={styles.btnInserir}>
            <Text style={styles.txtBtnInserir}>Inserir</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.divtopo}>
        <Text style={styles.txtTopo}>Wanderson Oliveira</Text>
        <TouchableOpacity style={styles.btnUser}>
          <Feather name="user" size={38} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <View style={styles.infoSaldo}>
          <Text style={styles.txtInfoSG}>Saldo</Text>
          <Text style={{ color: "#d1d1d1" }}>
            R$
            {mostrarValor ? (
              <Text style={styles.txtValorSaldo}>{totalReceita}</Text>
            ) : (
              <Text style={styles.txtValorSaldo}> --------</Text>
            )}
          </Text>
        </View>
        <View style={styles.infoGastos}>
          <Text style={styles.txtInfoSG}>Gastos</Text>
          <Text style={{ color: "#d1d1d1" }}>
            R$
            {mostrarValor ? (
              <Text style={styles.txtValorGastos}>{totalDespesa}</Text>
            ) : (
              <Text style={styles.txtValorGastos}> --------</Text>
            )}
          </Text>
        </View>
        <View style={styles.infoOlho}>
          <TouchableOpacity onPress={() => setMostrarValor(!mostrarValor)}>
            {mostrarValor ? (
              <Ionicons name="ios-eye-off-outline" size={36} color="black" />
            ) : (
              <Ionicons name="ios-eye-outline" size={36} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divMenu}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.itemMenu}>
            <TouchableOpacity
              style={styles.btnMenu}
              onPress={() => setAbrirModal(true)}
            >
              <AntDesign name="addfolder" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.txtBtnMenu}>Entradas</Text>
          </View>
          <View style={styles.itemMenu}>
            <TouchableOpacity
              style={styles.btnMenu}
              onPress={() => navigation.navigate("Investimento")}
            >
              <MaterialIcons name="attach-money" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.txtBtnMenu}>Investimentos</Text>
          </View>
          <View style={styles.itemMenu}>
            <TouchableOpacity style={styles.btnMenu}>
              <AntDesign name="addfolder" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.txtBtnMenu}>Item 3</Text>
          </View>
          <View style={styles.itemMenu}>
            <TouchableOpacity style={styles.btnMenu}>
              <AntDesign name="addfolder" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.txtBtnMenu}>Item 4</Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.viewMovimentacoes}>
        <Text style={styles.txtMov}>Movimentações</Text>
      </View>
      <View style={styles.viewFlatList}>
        <FlatList
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          data={lista}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity activeOpacity={0.8} style={styles.itemList}>
                <Text style={styles.itemData}>{item.data}</Text>
                <View style={styles.viewListItem}>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                  {Number(item.tipo) === 1 ? (
                    <Text style={styles.txtValorReceita}> R$ {item.valor}</Text>
                  ) : (
                    <Text style={styles.txtValorDespesa}> R$ {item.valor}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  divtopo: {
    height: 130,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingStart: 16,
    paddingEnd: 16,
  },
  info: {
    height: 80,
    backgroundColor: "#fff",
    marginStart: 16,
    marginEnd: 16,
    marginTop: -26,
    borderRadius: 12,
    zIndex: 99,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingStart: 16,
    paddingEnd: 16,
    paddingTop: 10,
  },
  txtTopo: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  btnUser: {
    width: 48,
    height: 48,
    backgroundColor: "#B1B1BD",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  divMenu: {
    height: 100,
    backgroundColor: "#fafafa",
    marginStart: 16,
    marginEnd: 16,
    flexDirection: "row",
  },
  btnMenu: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#d8d8d8",
    alignItems: "center",
    justifyContent: "center",
  },
  itemMenu: { width: 100, height: 80, alignItems: "center" },
  viewModal: { flex: 1, backgroundColor: "#fff" },
  btnAbrirModal: {
    width: 48,
    height: 48,
    backgroundColor: "#d1d1d1",
    borderRadius: 24,
    position: "absolute",
    right: 10,
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 60,
    fontSize: 26,
    borderWidth: 2,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 15,
    textAlign: "center",
  },
  btnInserir: {
    width: "60%",
    height: 40,
    borderWidth: 2,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 30,
    textAlign: "center",
    backgroundColor: "#F6CD42",
    justifyContent: "center",
    alignItems: "center",
  },
  txtBtnInserir: { fontSize: 22, fontWeight: "bold" },
  txtBtnMenu: { fontSize: 14, fontWeight: "bold" },
  txtInfoSG: { fontSize: 20, color: "#d1d1d1" },
  txtValorSaldo: { fontWeight: "bold", fontSize: 22, color: "#4B7D0F" },
  txtValorGastos: { fontWeight: "bold", fontSize: 22, color: "#C21300" },
  viewMovimentacoes: {
    height: 30,
    paddingStart: 16,
    paddingEnd: 16,
    paddingTop: 5,
  },
  txtMov: { fontWeight: "bold", fontSize: 22 },

  viewFlatList: {
    flex: 1,
    backgroundColor: "#d8d8d8",
    marginStart: 16,
    marginEnd: 16,
    marginTop: 10,
  },
  itemList: {
    width: "100%",
    height: 70,
    backgroundColor: "#fff",
    marginBottom: 3,
  },
  itemData: { fontSize: 12, color: "#F6CD42" },
  viewListItem: {
    paddingLeft: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  itemDesc: { fontSize: 16, fontWeight: "bold" },
  txtValorReceita: { fontSize: 16, fontWeight: "bold", color: "green" },
  txtValorDespesa: { fontSize: 16, fontWeight: "bold", color: "red" },

  dropCont: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 16,
    alignSelf: "center",
    marginTop: 8,
  },
  listLabeldrop: {
    fontSize: 20,
    textAlign: "center",
  },
  placeDrop: {
    color: "grey",
    fontSize: 26,
    textAlign: "center",
  },
});
