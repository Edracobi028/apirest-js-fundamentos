diff --git a/src/actions/types.js b/src/actions/types.js
index 25b92bf..d8a5f72 100644
--- a/src/actions/types.js
+++ b/src/actions/types.js
+++ b/src/actions/types.js
@@ -13,12 +13,12 @@ const types = {
   RESET_ALL_DATA: 'RESET_ALL_DATA',
   CONFIGURACION_FETCHING: 'CONFIGURACION_FETCHING',
   FETCHING_END: 'FETCHING_END',
-  REGISTRO_OK: 'Se registro con exito el cobro',
+  REGISTRO_OK: 'Se registró con éxito el cobro',
   REGISTRO_FAILD: 'No se pudo registrar el cobro',
-  ENTREGA_OK: 'Se registro con exito la entrega',
+  ENTREGA_OK: 'Se registró con exito la entrega',
   ENTREGA_FAILD: 'No se pudo registrar la entrega',
   MAS_TOTAL: 'No puedes pagar más del importe total',
-  RESTANTE_CERO: 'No puedes pagar mas del restante',
+  RESTANTE_CERO: 'No puedes pagar más del restante',
   MENOS_TOTAL: 'No puedes pagar menos del importe total',
   MAS_FACTURA: 'No puedes pagar más del saldo de una factura',
   MENOS_FACTURA_ABONO: 'No puedes pagar menos del saldo a una o más facturas, para poder dar anticipo',
@@ -27,22 +27,22 @@ const types = {
   ENTREGA_ADD: 'ENTREGA_ADD',
   ENTREGA_UPDATE: 'ENTREGA_UPDATE',
   ENTREGA_FETCHING: 'ENTREGA_FETCHING',
-  PDF_GENERADO: 'Se genero el PDF con exito', 
+  PDF_GENERADO: 'Se generó el PDF con exito', 
   SAP_SEND: 'Enviado en SAP',
   SAP_LOCAL: 'No se ha enviado a SAP',
-  DISPOSITIVO_OK: 'Se conecto con exito el dispositivo',
+  DISPOSITIVO_OK: 'Se conectó con éxito el dispositivo',
   DISPOSITIVO_FAIL: 'No se pudo conectar con el dispositivo',
-  DISPOSITIVO_FAIL_LEYENDA: 'Asegurate que este encendido el Bluetooth del dispositivo',
-  DISPOSITIVO_DISCONECT: 'Se desconecto con exito el dispositivo',
+  DISPOSITIVO_FAIL_LEYENDA: 'Asegúrate que esté encendido el Bluetooth del dispositivo',
+  DISPOSITIVO_DISCONECT: 'Se desconectó con éxito el dispositivo',
   BLUETOOTH_OFF: 'Bluetooth apagado',
   BLUETOOTH_OFF_LEYENDA: 'Enciende el Bluetooth para poder buscar dispositivos',
   PRINTER_ADD: 'PRINTER_ADD',
   PRINTER_RESET: 'PRINTER_RESET',
-  PRINTER_NONE: 'No esta conectado a una impresora',
+  PRINTER_NONE: 'No está conectado a una impresora',
   TICKETS_UPDATE: 'TICKETS_UPDATE',
-  TICKET_DELETE: 'Se cancelo correctamente el ticket',
   TICKETS_UPDATE: 'TICKETS_UPDATE',
-  TICKET_DELETE: 'Se cancelo correctamente el ticket',
+  TICKET_DELETE: 'Se canceló correctamente el ticket',
   TICKET_DELETE_FAIL: 'No se pudo cancelar el ticket',
-  ENTREGA_DELETE: 'Se cancelo correctamente la entrega',
+  ENTREGA_DELETE: 'Se canceló correctamente la entrega',
   ENTREGA_DELETE_FAIL: 'No se pudo cancelar la entrega',
   FORMA_FATURAS: 'Pago a facturas',
   FORMA_ABONO: 'Anticipo',
@@ -50,13 +50,14 @@ const types = {
   ABONO: 1,
   ANTICIPO: 2,
   MIXTO: 3,
-  PASSWORD_NEW: 'Se cambio la contraseña con éxito',
+  PASSWORD_NEW: 'Se cambió la contraseña con éxito',
+  PASSWORD_NEW: 'Se cambió la contraseña con éxito',
   PASSWORD_FAIL: 'No se pudo cambiar la contraseña, vuelve a iniciar sesión e intenta de nuevo',
   PASSWORD_FAIL: 'No se pudo cambiar la contraseña, vuelve a iniciar sesión e intenta de nuevo',
   LOGIN_FAIL: 'Usuario o contraseña incorrecta',
   FETCH_VENDEDOR_FAIL: 'No se pudó iniciar sesión, intenta más tarde',
-  CONECTION_FAIL: 'Conectate a internet para poder ingresar',
+  CONECTION_FAIL: 'Conéctate a internet para poder ingresar',
   SIN_REFERENCIA: 'Se debe ingresar una referencia de pago por lo menos de 4 caracteres',
   FACTURAS_ACEPTADAS: ['RV', 'ZM'],
+  SIN_CUENTA: 'Se debe seleccionar una cuenta de banco',
 };

 export default types;
\ No newline at end of file
diff --git a/src/components/Captura/index.js b/src/components/Captura/index.js
index 8c861de..64d5863 100644
--- a/src/components/Captura/index.js
+++ b/src/components/Captura/index.js
@@ -29,6 +29,7 @@ import moment from 'moment';
 import 'moment/locale/es';

 export default function Captura(props) {
+  //rz Aqui se declaran las variables
   const { data } = props;
   withNavigationFocus(Captura)
   const { syncs } = useSelector(state => { return state });
@@ -82,6 +83,13 @@ export default function Captura(props) {
     setOrientation(isPortrait())
   });
 
+  //rz variables para forma de pago y cuentas
+  const [idFormaPago, setIdFormaPago] =  useState("01"); //rz declaramos la variable del id forma de pago
+  const [searchC, setSearchC] = useState('');
+  const [datassC, setDatassC] = useState([]);
+  const [cuenta, setCuenta] = useState(""); //rz variable para el nombre cuenta
+  const [idCuenta, setIdCuenta] = useState(""); //rz variable para el id cuenta
+  //1er Efect Aqui se cargan los clientes para el select 
   useEffect(() => {
     const data = syncs.clientes;
     let clienteTmp = [];
@@ -98,15 +106,38 @@ export default function Captura(props) {
     }
     setReferencia('');
     setDatass(clienteTmp);
-    //console.log(clienteTmp)
   }, [search]);
 
+  //2do Efect Aqui se cargan las cuentas para el select
+  useEffect(() => {
+    console.log("copia del 1er efect, entro a cargar searchh");
+    const data = syncs.configuracion.cuentas; //guarda en variable las cuentas
+    //console.log("dat = "+JSON.stringify(data)); //rzc 
+    let cuentaTmp = [];
+    if (size(searchC) > 2) {
+      data.filter(function (cuenta) {
+        if (cuenta.nombreCuenta.toLowerCase().includes(searchC.toLowerCase())
+          || cuenta.idCuenta.includes(searchC)) {
+          cuentaTmp.push(cuenta);
+        }
+      });
+    }
+    if (cuentaTmp.length === 0 && size(searchC) > 2) {
+      //console.log("No se encontro cliente");
+    }
+    setReferencia(''); //rz8 Probable no se necesite
+    setDatassC(cuentaTmp);
+    console.log("En 1er Efect = "+searchC);
+  }, [searchC]);
+
+  //3er Efect para actualizar tickets
   useEffect(() => {
     if (porActualizar > 0) {
       updateTickets();
     }
   }, [porActualizar]);
 
+  //4to Efect para obtener Usuario, Monedas y Forma de pago
   useEffect(() => {
     let tickets = syncs.tickets;
     let { configuracion } = syncs;
@@ -139,7 +170,7 @@ export default function Captura(props) {
     setPorActualizar(faltantes);
     //console.log("buscando")
   }
-
+  //4to Efect para moneda
   useEffect(() => {
     listaMoneda.map(function (monedaLista) {
       //console.log(monedaLista)
@@ -157,7 +188,6 @@ export default function Captura(props) {
       setNombrePGL(cliente.NAME1.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }))
     }
     let abonoMaximoTMP = 0;
-    //console.log("que pex")
     let tmpFacts = cliente && cliente.facturas ? cliente.facturas : [];
     setSaldoAFavor(tmpFacts && tmpFacts.length > 0 ? types.FORMA_FATURAS : types.FORMA_ABONO);
     if (tmpFacts.length > 0) {
@@ -177,7 +207,6 @@ export default function Captura(props) {
           result.forEach(fact_ticket => { //Itero los tickets donde aparece el cliente
             if (fact_ticket.cancelado === "0" && fact_ticket.rechazado === "0") {
               fact_ticket.facturas_abono.forEach(fact_pago => { // Itero las facturas del ticket
-                //console.log("entro")
                 let facturaTicket = fact_pago.BELNR;
                 let abonoFacturaTicket = parseFloat(fact_pago.abono).toFixed(2);
                 let tmpSaldoFacturaTicket = parseFloat(fact_pago.tmp_saldo).toFixed(2);
@@ -188,7 +217,6 @@ export default function Captura(props) {
                   if (facturaReal = "0290069478") {
                     tmpSaldo -= 8
                   }
-                  //console.log(facturaTicket, tmpSaldo, SaldoFacturaTicketMinimo, SaldoFacturaTicket)
                   if (restanteFacturaTicket === tmpSaldo) {
                     return
                   } else if (tmpSaldo >= SaldoFacturaTicketMinimo) {
@@ -198,26 +226,21 @@ export default function Captura(props) {
               })
             }
           });
-          abonoFactura = parseFloat(ab);
-          //console.log("total", ab);
+          abonoFactura = parseFloat(ab).toFixed(2); //Recortar a 2 decimales para evitar saldo negativo por decimales
           element.tmp_saldo = parseFloat(element.WRBTR).toFixed(2) - abonoFactura;
           //element.saldo =  parseFloat(element.WRBTR).toFixed(2) - abonoFactura;
-          ///console.log(ab);
-          //console.log("aaaa", abonoFactura)
         } else {
           tmpElement.tmp_saldo = tmpElement.WRBTR;
         }
         abonoMaximoTMP = abonoMaximoTMP + parseFloat(tmpElement.tmp_saldo);
-        //console.log("factura", tmpElement.BELNR, "total", parseFloat(tmpElement.DMBTR), "abono", abonoFactura, "saldo",parseFloat(tmpElement.tmp_saldo))
       });
       setAbonoMaximo(abonoMaximoTMP);
-      //console.log(tmpFacts)
       setFacturas(tmpFacts)
     }
   }

+  //5to Efect para obtener cliente
   useEffect(() => {
-    //console.log("entro")
     const data2 = [];
     let clienteTmp = [];
     if (size(search) > 2) {
@@ -235,9 +258,28 @@ export default function Captura(props) {
     setDatass(clienteTmp);
     setRestanteImporte(0)
     getTicketsFacturas();
-    //console.log(clienteTmp)
   }, [cliente, syncs]);

+  //6to Efect se carga search con un data3 por descifrar
+  useEffect(() => {
+    //console.log("Entre a Copia de 5to useefect");
+    const data3 = [];
+    let cuentaTmp = [];
+    if (size(searchC) > 2) {
+      data3.filter(function (cuenta) {
+        if (cuenta.nombreCuenta.toLowerCase().includes(searchC.toLowerCase())
+          || cuenta.idCuenta.includes(searchC) ) {
+          cuentaTmp.push(cuenta);
+        }
+      });
+    }
+    if (cuentaTmp.length === 0 && size(searchC) > 2) {
+      //console.log("No se encontro cliente");
+    }
+    setDatassC(cuentaTmp);
+  }, [cuenta, syncs]);
+
+  //7mo Efect para fomra de pago
   useEffect(() => {
     getReferencia().then(async (result) => {
       setDescripcion(result && result.descripcion ? result.descripcion : "");
@@ -249,20 +291,40 @@ export default function Captura(props) {
     });
   }, [formaPago]);

+    //rz1 Obtiene la cuenta seleccionada y se asigna a las variables de id y nombre de cuenta 
+    const handlePickCount = (value) => {
+      console.log("Antes idCuenta =" + JSON.stringify(idCuenta));
+      console.log("Nombre de cuenta =" + JSON.stringify(value.nombreCuenta));
+      console.log("Id de cuenta =" + JSON.stringify(value.idCuenta)); 
+      setCuenta(value.nombreCuenta); //rz guardar el valor id de cuenta
+      setIdCuenta(value.idCuenta); //rz guardar el nombre de cuenta
+      console.log("Final idCuenta =" + JSON.stringify(idCuenta)); 
+    };
+    
+    
+  
+
   async function getReferencia() {
-    //console.log("cambiendo", formaPago);
     let result = ListaFormaPago.filter(fpago => fpago.nombre === formaPago)[0];
     return result;
   }

+  //Metodo para obtener el id de forma de pago
+  const getIdFormaPago = (value) =>{
+      ListaFormaPago.map(function (fpago){
+      if(fpago.nombre === value){
+        console.log("Id de forma de pago = "+fpago.idFormaPago);
+        setIdFormaPago(fpago.idFormaPago);
+      }
+    });
+  };
+
   const getImporte = (value) => {
     let abono = 0;
-    //console.log(value)
     facturas.forEach(element => {
       element.abono = 0;
     });
     listaMoneda.map(function (monedaLista) {
-      //console.log(monedaLista)
       if (monedaLista.nombre === moneda) {
         abono = parseFloat(value) * parseFloat(monedaLista.valor_peso);
         setTipoCambio(monedaLista.valor_peso)
@@ -315,6 +377,11 @@ export default function Captura(props) {
       setVisible(true)
       flag = false;
       return flag
+    } else if ( (cuenta === "") ){
+      setMensaje(types.SIN_CUENTA);
+      setVisible(true)
+      flag = false;
+      return flag
     }
     if (saldoAFavor === types.FORMA_FATURAS) {
       let importeFinal = 0;
@@ -369,7 +436,6 @@ export default function Captura(props) {
         setCargando(true);
         setPagoFinal(types.ANTICIPO);
       }
-      //console.log(importe)
     }
     return flag;
   }
@@ -480,7 +546,10 @@ export default function Captura(props) {
       comentariosRechazo: "",
       email,
       enviado,
-      emailCC
+      emailCC,
+      id_forma_Pago:idFormaPago, //rz
+      cuenta:cuenta, //rz
+      id_cuenta:idCuenta, //rz
     }
     let next = dispatch({ type: "TICKETS_ADD", payload: { ticket: info } });
     if (next) {
@@ -495,6 +564,9 @@ export default function Captura(props) {
           await requestExternalWritePermission(info, logo, 0, resa, qrCliente, qrClienteMensaje);
           setCliente(null);
           setSearch("");
+          setSearchC(""); //rz limpia busqueda
+          setIdCuenta(""); //rz limpia id
+          setCuenta(""); //rz limpia cuenta
           setMensaje(types.REGISTRO_OK);
           setVisible(true);
         }
@@ -513,6 +585,9 @@ export default function Captura(props) {
           onPress: async () => {
             setCliente(null);
             setSearch("");
+            setSearchC(""); //rz limpia busqueda
+            setIdCuenta(""); //rz limpia id
+            setCuenta(""); //rz limpia cuenta
             setCargando(false);
             setMensaje(types.REGISTRO_OK);
             setVisible(true);
@@ -525,6 +600,9 @@ export default function Captura(props) {
           onPress: async () => {
             setCliente(null);
             setSearch("");
+            setSearchC(""); //rz limpia busqueda
+            setIdCuenta(""); //rz limpia id
+            setCuenta(""); //rz limpia cuenta
             setCargando(false);
             setMensaje(types.REGISTRO_OK);
             setVisible(true);
@@ -602,7 +680,7 @@ export default function Captura(props) {
                     <Dialog.Content>
                       <Paragraph>Selecciona una forma de pago</Paragraph>
                       <RadioButton.Group
-                        onValueChange={value => setFormaPago(value)}
+                        onValueChange={value => { setFormaPago(value); getIdFormaPago(value) }}
                         value={formaPago}
                         style={{ marginTop: 15, height: 50, width: 10 }}
                         key="grupopago"
@@ -632,6 +710,33 @@ export default function Captura(props) {
                   : null
                 }
                 <Divider style={{ borderBottomWidth: 2, borderColor: colors.text }} />
+
+
+                {/* ///rz1 Select de cuenta bancaria */}
+                <Title style={styles.title}>Seleccione Cuenta Bancaria </Title>
+
+                  <Autocomplete
+                    key={usuario + "auto"}
+                    autoCapitalize="none"
+                    autoCorrect={false}
+                    //containerStyle={styles.autocompleteContainer} //se comento porque modifica su posicion
+                    data={datassC}
+                    defaultValue={ idCuenta?(idCuenta + " - " + cuenta):"" } //condicion para mostrar lo seleccionado
+                    listStyle={{ backgroundColor: colors.surface, maxHeight: 350 }}
+                    hideResults={cuenta && !searchC}
+                    onChangeText={(e) => setSearchC(e)} 
+                    onChange={handlePickCount}
+                    //getOptionLabel={(item) =>  item.idCuenta + "-" + item.nombreCuenta } //rz8 se prueba con item probable no se neesite
+                    placeholder="Buscar cuenta"
+                    keyExtractor={(item, index) => index.toString()}
+                    renderItem={({ item }) => (
+                      <TouchableHighlight onPress={() => { { setCuenta(item); handlePickCount(item); setSearchC(""); Keyboard.dismiss(); } }}>
+                        <Text key={item.idCuenta + item.idCuenta} style={styles.itemText}> {item.idCuenta} - {item.nombreCuenta} </Text>
+                      </TouchableHighlight>
+                    )}
+                  /> 
+
+                <Divider style={{ borderBottomWidth: 2, borderColor: colors.text }} />
                 {/* <TouchableHighlight onPress={showDialogSaldoAFavorVisible} key="saldoafavor"> */}
                 <Title style={styles.title}>Tipo de cobranza:  {saldoAFavor} </Title>
                 {/* </TouchableHighlight> */}
diff --git a/src/components/Home/index.js b/src/components/Home/index.js
index 0f90265..e3bc0c5 100644
--- a/src/components/Home/index.js
+++ b/src/components/Home/index.js
@@ -173,7 +173,7 @@ export default function Home() {
               </Card.Content>
               <Button icon="reload" mode="contained" style={styles.botonesGrandes} disabled={!internet} onPress={getInformation}>Actualizar información</Button>
               <Button icon="arrow-down-bold-box-outline" mode="contained" style={styles.botonesGrandes} disabled={!internet} onPress={getFacts}>Facturas del día</Button>
-              <Title style={styles.titleVersion}>{`Versión 1.5.3`}</Title>
+              <Title style={styles.titleVersion}>{`Versión 1.5.4`}</Title>
             </View>
           </>
         }
diff --git a/src/components/Menu/index.js b/src/components/Menu/index.js
index a2506f9..9d326f4 100644
--- a/src/components/Menu/index.js
+++ b/src/components/Menu/index.js
@@ -145,7 +145,7 @@ export default function DrawerContent(props) {
             </Portal>
           </View>
         </TouchableRipple>
-        <Title style={styles.titleVersion}>{`Versión 1.5.3`}</Title>
+        <Title style={styles.titleVersion}>{`Versión 1.5.4`}</Title>
       </Drawer.Section>
     </DrawerContentScrollView>
   );
diff --git a/src/containers/Auth/index.js b/src/containers/Auth/index.js
index f9a6631..7c77019 100644
--- a/src/containers/Auth/index.js
+++ b/src/containers/Auth/index.js
@@ -155,7 +155,7 @@ export default function Auth() {

         </View>
         <View style={{ height: 100, marginTop: 20 }}>
-          <Title style={styles.titleVersion}>{`Versión 1.5.3`}</Title>
+          <Title style={styles.titleVersion}>{`Versión 1.5.4`}</Title>

           <Button mode="contained" style={styles.botones} onPress={login} loading={respuesta}>
             Iniciar sesión
diff --git a/src/utils/getInfo.js b/src/utils/getInfo.js
index 4e04160..7cc119c 100644
--- a/src/utils/getInfo.js
+++ b/src/utils/getInfo.js
@@ -478,34 +478,41 @@ export const getFacturasTicket = (faturas) => {

 async function getFacturasTicketPrinter(faturas, total, otrosDatos) {
   let mas_una = faturas.length > 1 ? true : false;
+  await BluetoothEscposPrinter.printText("\n\r", textOpc);
   await BluetoothEscposPrinter.printText(mas_una ? "--------Facturas abonadas-------\n\r" : "--------Factura abonada-------\n\r", {});
   let textOpc = {
-    encoding: 'Cp857',
-    codepage: 255,
+    encoding: 'Cp850',
+    codepage: 2,
     widthtimes: 0,
     heigthtimes: 0,
     fonttype: 1
   }
+  let numeroChico = {
+    encoding: 'Cp437',
+    codepage: 0,
+    fonttype: 2
+  };
   let factsColumn = [20, 20];
   faturas.map(async (element) => {
+    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);//centrar
     BluetoothEscposPrinter.printColumn(factsColumn,
       [BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER],
       ["Factura", element.BELNR + " "], textOpc);
     BluetoothEscposPrinter.printColumn(factsColumn,
       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-      ["Fecha vencimiento", element.BLDAT + " "], textOpc);
+      ["Fecha vencimiento", element.BLDAT + ""], numeroChico);
     BluetoothEscposPrinter.printColumn(factsColumn,
       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-      ["Total", formatCurrency(element.DMBTR) + ""], textOpc);
+      ["Total", formatCurrency(element.DMBTR) + ""], numeroChico);
     BluetoothEscposPrinter.printColumn(factsColumn,
       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-      ["Saldo", formatCurrency(element.tmp_saldo) + ""], textOpc);
+      ["Saldo", formatCurrency(element.tmp_saldo) + ""], numeroChico);
     BluetoothEscposPrinter.printColumn(factsColumn,
       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-      ["Abono", formatCurrency(element.abono) + ""], textOpc);
+      ["Abono", formatCurrency(element.abono) + ""], numeroChico);
     BluetoothEscposPrinter.printColumn(factsColumn,
       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-      ["Restante", element.DMBTR !== "0" ? formatCurrency(element.tmp_saldo - element.abono) + "" : "$0.00"], textOpc);
+      ["Restante", element.DMBTR !== "0" ? formatCurrency(element.tmp_saldo - element.abono) + "" : "$0.00"], numeroChico);
     BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
   })
   await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
@@ -523,10 +530,10 @@ async function getFacturasTicketPrinter(faturas, total, otrosDatos) {
         ["Factura", element.BELNR + " "], textOpc);
       BluetoothEscposPrinter.printColumn(factsColumn,
         [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-        ["Total", formatCurrency(element.DMBTR) + ""], textOpc);
+        ["Total", formatCurrency(element.DMBTR) + ""], numeroChico);
       BluetoothEscposPrinter.printColumn(factsColumn,
         [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-        ["Saldo", formatCurrency(element.WRBTR) + ""], textOpc);
+        ["Saldo", formatCurrency(element.WRBTR) + ""], numeroChico);
       BluetoothEscposPrinter.printColumn(factsColumn,
         [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
         ["Fecha vencimiento", element.BLDAT + ""], textOpc);
@@ -542,8 +549,8 @@ async function getMaterialesTicketPrinter(materiales, otrosDatos) {
   if (otrosDatos.length > 0) {
     await BluetoothEscposPrinter.printText(mas_una ? "--------  Materiales  -------\n\r" : "--------  Material  -------\n\r", {});
     let textOpc = {
-      encoding: 'Cp857',
-      codepage: 255,
+      encoding: 'Cp850',
+      codepage: 2,
       widthtimes: 0,
       heigthtimes: 0,
       fonttype: 1
@@ -584,26 +591,37 @@ export const printTicket = async (ticket, logo, otrosDatos, opc, qr, mensaje) =>
       vendedor_nombre = vendedor_nombre.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
       cliente_nombre = cliente_nombre.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
       let tituloOpciones = {
-        encoding: 'Cp857',
-        codepage: 255,
+        encoding: 'Cp850',
+        codepage: 2,
         widthtimes: 1,
         heigthtimes: 1,
         fonttype: 1
       };
       let textoChico = {
-        encoding: 'Cp857',
-        codepage: 255,
-        widthtimes: 3,
-        heigthtimes: 3,
+        encoding: 'Cp850',
+        codepage: 2,
+        widthtimes: 0,
+        heigthtimes: 0,
         fonttype: 1
       };
       let comentariosTexto = {
-        encoding: 'Cp857',
-        codepage: 255,
-        widthtimes: 2,
-        heigthtimes: 2,
+        encoding: 'Cp850',
+        codepage: 2,
+        widthtimes: 0,
+        heigthtimes: 0,
+        fonttype: 0
+      };
+      let numeroChico = {
+        encoding: 'Cp850',
+        codepage: 2,
+        widthtimes: 0,
+        heigthtimes: 0,
         fonttype: 2
       };
+      let textoNormal = {
+        encoding: 'Cp850', 
+        fonttype: 0
+      }
       let factsColumn = [16, 26];
       let infoColumn = [26, 16];
       await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
@@ -611,13 +629,13 @@ export const printTicket = async (ticket, logo, otrosDatos, opc, qr, mensaje) =>
       await BluetoothEscposPrinter.printerLeftSpace(0);
       await BluetoothEscposPrinter.setBlob(0);
       await BluetoothEscposPrinter.printText("\n\r", textoChico);
-      await BluetoothEscposPrinter.printPic(logo, { width: 250, left: 50 });
+      await BluetoothEscposPrinter.printPic(logo, { width: 250, left: 70 });
       await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
       await BluetoothEscposPrinter.printText(" Agri Star México \n\n\r", tituloOpciones);
       await BluetoothEscposPrinter.setBlob(0);
-      await BluetoothEscposPrinter.printText("Registro de cobranza \n\r", {});
-      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
-      await BluetoothEscposPrinter.printText("Agri Star México S de RL de CV\n\r", { encoding: 'Cp857', codepage: 255 });
+      await BluetoothEscposPrinter.printText("Registro de cobranza \n\r", {encoding: 'Cp850'});
+      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
+      await BluetoothEscposPrinter.printText("Agri Star México S de RL de CV\n\r", { encoding: 'Cp850'});
       await BluetoothEscposPrinter.printText("Av. Mariano Otero #2347, 3er piso\n\r", textoChico);
       await BluetoothEscposPrinter.printText("Col. Verde Valle, C.P. 44550, Gdl, Jal.\n\r", textoChico);
       //await BluetoothEscposPrinter.printText("Guadalajara, Jalisco\n\r",textoChico);
@@ -631,7 +649,7 @@ export const printTicket = async (ticket, logo, otrosDatos, opc, qr, mensaje) =>
           ["Ticket:", num_ticket + ""], textoChico);
       }
       await BluetoothEscposPrinter.printColumn(factsColumn, [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-        ["Via:", "Movil" + ""], textoChico);
+        ["Vía:", "Móvil" + ""], textoChico);
       await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
       await BluetoothEscposPrinter.printColumn(factsColumn, [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
         ["Vendedor:", vendedor_nombre + ""], textoChico);
@@ -651,13 +669,13 @@ export const printTicket = async (ticket, logo, otrosDatos, opc, qr, mensaje) =>
             ["Referencia: ", referencia + ""], textoChico);
         }
         await BluetoothEscposPrinter.printColumn(factsColumn, [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-          ["Moneda: ", "$" + moneda_pago], textoChico);
+          ["Moneda: ", "$" + moneda_pago], numeroChico);
         if (tipo_cambio !== "1") {
           await BluetoothEscposPrinter.printColumn(factsColumn, [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
             ["Tipo de cambio: ", tipo_cambio + ""], textoChico);
         }
         await BluetoothEscposPrinter.printColumn([10, 32], [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
-          ["Tipo:", tipo && tipo === types.ANTICIPO ? "Anticipo" : tipo && tipo === types.MIXTO ? 'Abono a faturas y anticipo' : 'Abono a faturas'], textoChico);
+          ["Tipo:", tipo && tipo === types.ANTICIPO ? "Anticipo" : tipo && tipo === types.MIXTO ? 'Abono a facturas y anticipo' : 'Abono a facturas'], textoChico);
         await BluetoothEscposPrinter.printColumn(factsColumn, [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
           ["Fecha de abono:", fecha], textoChico);
         await getFacturasTicketPrinter(facturas_abono, importe_total, otrosDatos);
@@ -678,7 +696,7 @@ export const printTicket = async (ticket, logo, otrosDatos, opc, qr, mensaje) =>
           await BluetoothEscposPrinter.printText("\n\r", textoChico);
         } else {
           await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
-          await BluetoothEscposPrinter.printText("***  Exija su comprobante de abono o pago total de su factura sea esté en efectivo o     cheque. ***", textoChico);
+          await BluetoothEscposPrinter.printText("***  Exija su comprobante de abono o pago total de su factura sea este en efectivo o cheque. ***", textoNormal);
           await BluetoothEscposPrinter.printText("\n\r", textoChico);
           await BluetoothEscposPrinter.printText("\n\r", textoChico);
           if (comentarios && comentarios !== "") {
@@ -691,17 +709,17 @@ export const printTicket = async (ticket, logo, otrosDatos, opc, qr, mensaje) =>
           if (opc === 1) {
             await BluetoothEscposPrinter.setBlob(0);
             await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
-            await BluetoothEscposPrinter.printText("REIMPRESION\n", textoChico);
+            await BluetoothEscposPrinter.printText("REIMPRESIÓN\n", textoChico);
           }
           await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
-          await BluetoothEscposPrinter.printText("Gracias por su pago.\n\r", textoChico);
+          await BluetoothEscposPrinter.printText("Gracias por su pago.\n\r", textoNormal);
           await BluetoothEscposPrinter.printText("\n\r", textoChico);
           await BluetoothEscposPrinter.printText("\n\r", textoChico);
           if (qr) {
             await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
-            await BluetoothEscposPrinter.printText(mensaje + "", textoChico);
+            await BluetoothEscposPrinter.printText(mensaje + "", textoNormal);
             await BluetoothEscposPrinter.printText("\n\r", textoChico);
-            await BluetoothEscposPrinter.printPic(qr, { width: 250, left: 50 });
+            await BluetoothEscposPrinter.printPic(qr, { width: 250, left: 70 });
             await BluetoothEscposPrinter.printText("\n\r", textoChico);
             await BluetoothEscposPrinter.printText("\n\r", textoChico);
           }
(END)