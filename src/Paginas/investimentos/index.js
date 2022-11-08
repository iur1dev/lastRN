import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskInput, { Masks } from "react-native-mask-input";

import { VictoryPie } from "victory-native";

export default function Investimento({ navigation }) {
  const [listaI, setListaI] = useState([]);
  const [abrirModal, setAbrirModal] = useState(false);
  const [ativoF, setAtivoF] = useState(null);
  const [valorI, setValorI] = useState(null);
  const [dataI, setDataI] = useState("");
  const [tipo, setTipo] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Renda Fixa", value: "1" },
    { label: "Renda Variavel", value: "2" },
    { label: "Cripto Moeda", value: "3" },
  ]);

  const [rFixaPorc, setRFixaPorc] = useState(null);
  const [rVarPorc, setRVarPorc] = useState(null);
  const [rCriptoPorc, setRCriptoPorc] = useState(null);
  const [abrirModalInvestimentos, setAbrirModalInvestimentos] = useState(false);

  useEffect(() => {
    async function CarregarLista() {
      const listaStorage = await AsyncStorage.getItem("@listaI");
      if (listaStorage) {
        setListaI(JSON.parse(listaStorage));
      }
    }
    CarregarLista();
  }, []);

  useEffect(() => {
    async function SalvarLista() {
      await AsyncStorage.setItem("@listaI", JSON.stringify(listaI));
    }
    SalvarLista();
  }, [listaI]);

  function Investir() {
    if (ativoF && valorI && dataI && tipo) {
      setListaI((arr) => [
        ...arr,
        {
          id: Math.random(2 * 2),
          ativoF: ativoF,
          valorI: Number(valorI.substr(0, valorI.length - 2)).toFixed(2),
          dataI: dataI,
          tipo: tipo,
        },
      ]);

      Limpar();
      setAbrirModal(false);
    } else {
      alert("Preencha todos os campos !!!");
    }
  }

  function Limpar() {
    setAtivoF(null);
    setValorI(null);
    setDataI("");
    setTipo(null);
  }

  function PegarTipo() {
    let rFixa = listaI
      .filter((r) => r.tipo === "1")
      .map((item) => Number(item.valorI))
      .reduce((a, b) => a + b, 0);
    let rVariavel = listaI
      .filter((r) => r.tipo === "2")
      .map((item) => Number(item.valorI))
      .reduce((a, b) => a + b, 0);
    let rCriptoM = listaI
      .filter((r) => r.tipo === "3")
      .map((item) => Number(item.valorI))
      .reduce((a, b) => a + b, 0);
    let totalI = rFixa + rVariavel + rCriptoM;
    setRFixaPorc(((rFixa / totalI) * 100).toFixed(2));
    setRVarPorc(((rVariavel / totalI) * 100).toFixed(2));
    setRCriptoPorc(((rCriptoM / totalI) * 100).toFixed(2));
    setAbrirModalInvestimentos(true);
    console.log(rFixaPorc);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={abrirModalInvestimentos}
      >
        <View style={styles.viewModal}>
          <View style={styles.itemListInvPorcRf}>
            <Text style={{ fontSize: 22 }}>Renda Fixa : {rFixaPorc}%</Text>
          </View>
          <View style={styles.itemListInvPorcRv}>
            <Text style={{ fontSize: 22 }}>Renda Variavel : {rVarPorc}%</Text>
          </View>
          <View style={styles.itemListInvPorcCm}>
            <Text style={{ fontSize: 22 }}>CriptoMoeda : {rCriptoPorc}%</Text>
          </View>

          <VictoryPie
            colorScale={["#BFE1C8", "#79DB91", "#FFD84D", "cyan", "navy"]}
            data={[
              { x: 1, y: rFixaPorc / 100, label: "RF" },
              { x: 2, y: rVarPorc / 100, label: "RV" },
              { x: 3, y: rCriptoPorc / 100, label: "CM" },
            ]}
          />
          <TouchableOpacity
            onPress={() => setAbrirModalInvestimentos(false)}
            style={styles.btnAbrirModal}
          >
            <Ionicons name="arrow-back" size={38} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={false} visible={abrirModal}>
        <View style={styles.viewModal}>
          <TouchableOpacity
            onPress={() => setAbrirModal(false)}
            style={styles.btnAbrirModal}
          >
            <Ionicons name="arrow-back" size={38} color="black" />
          </TouchableOpacity>

          <TextInput
            placeholder="Ativo Financeiro"
            value={ativoF}
            onChangeText={setAtivoF}
            style={styles.input}
          />

          <MaskInput
            style={styles.input}
            mask={Masks.BRL_CURRENCY}
            value={valorI}
            onChangeText={(masked, unmasked) => {
              setValorI(unmasked);
            }}
          />

          <MaskInput
            style={styles.input}
            mask={Masks.DATE_DDMMYYYY}
            value={dataI}
            onChangeText={setDataI}
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
          <TouchableOpacity onPress={Investir} style={styles.btnInvestir}>
            <Text style={styles.txtBtnInvestir}>Investir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={PegarTipo} style={styles.btnInvestir}>
            <Text style={styles.txtBtnInvestir}>Ver Investimentos</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.viewTopo}>
        <TouchableOpacity
          onPress={() => setAbrirModal(true)}
          style={styles.btnModalInvestir}
        >
          <Text style={styles.txtInvestirbtnModal}>Investir</Text>
          <MaterialIcons name="attach-money" size={56} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.viewCarteiraInv}>
        <Text style={styles.txtCarteiraInv}>Carteira de investimentos</Text>
      </View>

      <FlatList
        style={styles.flatInv}
        data={listaI}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.itemListInv}>
              <Text style={styles.itemAF}>{item.ativoF}</Text>
              <Text style={styles.itemData}>{item.dataI}</Text>
              <Text style={styles.itemValor}>R$ {item.valorI}</Text>
              <FontAwesome5 name="money-bill-alt" size={36} color="green" />
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.btnHome}
      >
        <Ionicons name="arrow-back" size={38} color="black" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewModal: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  btnInvestir: {
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
  txtBtnInvestir: {
    fontSize: 22,
    fontWeight: "bold",
  },
  viewTopo: {
    width: "100%",
    height: 130,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  btnModalInvestir: {
    width: "60%",
    height: 70,
    backgroundColor: "#30E655",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  txtInvestirbtnModal: {
    fontSize: 36,
    color: "#000",
    fontWeight: "bold",
    marginRight: 10,
  },
  viewCarteiraInv: {
    width: "90%",
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: -15,
  },
  txtCarteiraInv: {
    fontWeight: "bold",
    fontSize: 22,
  },
  flatInv: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnHome: {
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
  itemListInv: {
    width: "80%",
    height: 140,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "space-around",
    paddingLeft: 10,
  },
  itemAF: { fontSize: 18, fontWeight: "bold" },
  itemData: { fontSize: 16, color: "#000" },
  itemValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },

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
  itemListInvPorcRf: {
    width: "80%",
    height: 40,
    backgroundColor: "#BFE1C8",
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  itemListInvPorcRv: {
    width: "80%",
    height: 40,
    backgroundColor: "#79DB91",
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  itemListInvPorcCm: {
    width: "80%",
    height: 40,
    backgroundColor: "#FFD84D",
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
});
