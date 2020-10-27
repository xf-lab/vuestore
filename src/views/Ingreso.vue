<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar color="white">
                <v-toolbar-title>Ingresos</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" v-if="!nuevoIngreso"
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="nuevoIngreso==0" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
                <v-dialog v-model="modalArticulos" max-width="1000px">
                    <v-card>
                        <v-card-title> 
                            <span class="headline">Seleccione un artículo</span>
                        </v-card-title>            
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12>
                                        <v-text-field v-model="textoBusqueda" @keyup.enter="getArticulos()" class="text-xs-center" append-icon="search" 
                                        label="Búsqueda"></v-text-field>
                                        <template>
                                            <v-data-table
                                                :headers="cabeceraArticulos"
                                                :items="articulos"
                                                class="elevation-1"
                                            >
                                                <template v-slot:item="props">
                                                    <tr>
                                                        <td class="justify-center layout px-0">
                                                            <v-icon
                                                            class="mr-2"
                                                            @click="agregarDetalle(props.item)"
                                                            >
                                                            add
                                                            </v-icon>                                                    
                                                        </td>
                                                        <td>{{ props.item.codigo }}</td>
                                                        <td>{{ props.item.nombre }}</td>
                                                        <td>{{ props.item.categoria.nombre }}</td>
                                                        <td>{{ props.item.stock }}</td>
                                                        <td>{{ props.item.precio_venta }}</td>
                                                        <td>{{ props.item.descripcion }}</td>
                                                        <td>
                                                            <div v-if="props.item.estado">
                                                                <span class="blue--text">Activo</span>
                                                            </div>
                                                            <div v-else>
                                                                <span class="red--text">Inactivo</span>
                                                            </div>
                                                        </td> 
                                                    </tr>               
                                                </template>
                                            </v-data-table>
                                        </template>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" @click="close">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAction==1">
                            Activar Registro
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAction==2">
                            Desactivar Registro
                        </v-card-title>
                        <v-card-text>
                            ¿Está seguro de que quieres 
                            <span v-if="adAction==1">activar</span>
                            <span v-if="adAction==2">desactivar</span>
                             el usuario {{adNombre}} ?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="cerrarModalActDes" color="green darken-1">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAction == 1" @click="activarRegistro" color="orange darken-4">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAction == 2" @click="desactivarRegistro" color="orange darken-4">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="ingresos"
                :search="search"
                class="elevation-1"
                v-if="!nuevoIngreso"
            >
                <template v-slot:item="props">
                    <tr>
                        <td>
                            <v-icon 
                                @click="editItem(props.item)"
                                class="mr-2"
                            >edit
                            </v-icon>
                            <template v-if="props.item.estado">
                                <v-icon
                                small
                                @click="activarDesactivarMostrar(2,props.item)"
                                >
                                block
                                </v-icon>
                            </template>
                            <template v-else>
                                <v-icon
                                small
                                @click="activarDesactivarMostrar(1,props.item)"
                                >
                                check
                                </v-icon>
                            </template>
                        </td>
                            <td>{{ props.item.usuario.nombre }}</td>
                            <td>{{ props.item.persona.nombre }}</td>
                            <td>{{ props.item.tipo_comprobante }}</td>
                            <td>{{ props.item.serie_comprobante }}</td>
                            <td>{{ props.item.num_comprobante }}</td>
                            <td>{{ props.item.createdAt }}</td>
                            <td>{{ props.item.impuesto }}</td>
                            <td>{{ props.item.total }}</td>
                        <td>
                            <div v-if="props.item.estado === 1">
                                <span blue--text>Aceptado</span>
                            </div>
                            <div v-if="props.item.estado === 0">
                                <span red--text>Anulado</span>
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
            <v-container grid-list-sm class="pa-4 white" v-if="nuevoIngreso">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="editedItem.tipo_comprobante" 
                        :items="comprobantes" label="Tipo Comprobante" >
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="editedItem.serie_comprobante" label="Serie Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="editedItem.num_comprobante" label="Número Comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-autocomplete :items="personas" v-model="editedItem.persona" label="Proveedor">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="editedItem.impuesto" label="Impuesto">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 x8>
                        <v-text-field v-model="codigo" label="Código" @keyup.enter="buscaCodigo">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn small fab dark color="teal" @click="mostrarModalArticulos">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
                        <div class="red--text" v-text="errorArticulo">

                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                            <v-data-table
                                :headers="cabeceraDetalles"
                                :items="detalles"
                                class="elevation-1"
                                hide-default-footer
                            >
                                <template v-slot:item="props">
                                    <tr>
                                        <td>
                                           <v-icon @click="borrarItemDetalle(detalles,props.item)">delete</v-icon>
                                        </td>
                                        <td class="text-xs-center">{{ props.item.articulo }}</td>
                                        <td class="text-xs-center"><v-text-field v-model="props.item.cantidad"></v-text-field></td>
                                        <td class="text-xs-center"><v-text-field v-model="props.item.precio"></v-text-field></td>
                                        <td class="text-xs-right"> {{ props.item.cantidad * props.item.precio}} €</td>
                                    </tr>
                                </template>
                                <template slot="no-data">
                                    <h3>No hay artículos agregados al detalle.</h3>
                                </template>
                            </v-data-table>
                            <v-flex class="text-xs-right">
                                <strong>Total sin impuestos:</strong> 
                                {{ totalNeto = (editedItem.total-totalIVA).toFixed(2) }} €
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total impuesto:</strong>
                                {{ totalIVA = (((editedItem.total)/(1+editedItem.impuesto))*(editedItem.impuesto)).toFixed(2) }} €
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total:</strong> {{ editedItem.total = calcularTotal }} €
                            </v-flex>
                        </template>
                    </v-flex>
                    <v-flex xs12 sm12 md12 v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                            
                        </div>
                    </v-flex>  
                    <v-flex xs12 sm12 md12 lg12 xl12 d-flex mt-4 style="justify-content: space-evenly;">
                        <v-btn color="blue darken-1" @click="cierraNuevoIngreso">Cancelar</v-btn>
                        <v-btn color="success" @click="guardarIngreso" >Guardar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios';
    export default {
        data(){
            return{
                textoBusqueda: '',
                nuevoIngreso: false,
                search:'',
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Usuario', value: 'usuario.nombre', sortable: true },
                    { text: 'Proveedor', value: 'persona.nombre', sortable: true },
                    { text: 'Tipo Comprobante', value: 'tipo_comprobante', sortable: true },
                    { text: 'Serie comprobante', value: 'serie_comprobante', sortable: false  },
                    { text: 'Número comprobante', value: 'num_comprobante', sortable: false  },
                    { text: 'Fecha', value: 'createdAt', sortable: false  },
                    { text: 'Impuesto', value: 'impuesto', sortable: false  },
                    { text: 'Total', value: 'total', sortable: false  },
                    { text: 'Estado', value: 'estado', sortable: false  }   
                ],
                cabeceraDetalles:[
                    { text: 'Borrar', value: 'borrar', sortable: false },
                    { text: 'Artículo', value: 'articulo', sortable: false },
                    { text: 'Cantidad', value: 'cantidad', sortable: false },
                    { text: 'Precio', value: 'precio', sortable: false },
                    { text: 'Sub Total', value: 'subtotal', sortable: false  }
                ],
                cabeceraArticulos: [
                    { text: 'Seleccionar', value: 'seleccionar', sortable: false },
                    { text: 'Código',value: 'codigo', sortable: false},
                    { text: 'Nombre',value: 'nombre', sortable: true},
                    { text: 'Categoría',value: 'categoria.nombre', sortable: true},
                    { text: 'Stock',value: 'stock', sortable: false},
                    { text: 'Precio Venta',value: 'precio_venta', sortable: false},
                    { text: 'Descripción', value: 'descripcion', sortable: false },              
                    { text: 'Estado', value: 'estado', sortable: false }
                ],
                editedItem:
                    {
                        _id: '',
                        persona: '',
                        tipo_comprobante: '',
                        serie_comprobante: '',
                        tipo_documento: '',
                        num_comprobante: '',
                        impuesto: 0.21,
                        total: '',
                    },
                comprobantes: ['Factura', 'Ticket'],
                usuarios: [],
                personas: [],
                ingresos: [],
                detalles: [], 
                articulos: [],
                codigo: '',
                totalIVA:0,
                totalNeto:0,
                errorArticulo:null,
                modalArticulos: false,
                valida:0,
                validaMensaje:[],  
                adModal:0,
                adAction:0,
                adNombre:'',
                adId:''              
            }
        },
        computed: {
            calcularTotal(){
                let suma=0;
                let total=0;
                this.detalles.map( function(x) {
                    suma = x.precio * x.cantidad;
                    total += suma;
                });
                return total;            
            }
        },
        watch: {
            dialog (val) {
                val || this.close()
            }
        },
        created () {
            this.getArrayPersonas();
            this.listar();
        },
        methods: {
            buscaCodigo(){
                let me = this;
                me.errorArticulo=null;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('articulo/queryCodigo?codigo='+this.codigo ,configuracion).then(function (response){
                    console.log(response.data);
                    me.agregarDetalle(response.data);
                }).catch(function(error){
                    console.log(error);
                    me.errorArticulo='No existe el artículo.';
                });
            },
            agregarDetalle(data){
                this.errorArticulo=null;
                if (this.encuentra(data._id)==true){
                    this.errorArticulo='El artículo ya ha sido agregado.';
                }else{
                    this.detalles.push(
                        {
                            '_id': data._id,
                            'articulo' : data.nombre, 
                            'cantidad':1, 
                            'precio': data.precio_venta
                        }
                    );
                    this.codigo='';
                }
            },
            encuentra(id){
                let sw=0;
                for (var i=0;i<this.detalles.length;i++){
                    if(this.detalles[i]._id==id){
                        sw=true;
                    }
                }
                return sw;
            },
            borrarItemDetalle(arr,item){
                this.detalles.splice(arr.indexOf(item),1);
            },
            mostrarNuevo(){
                this.nuevoIngreso = true;
            },
            mostrarModalArticulos(){
                this.modalArticulos=true;
            },
            getArticulos(){
                let me = this;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('articulo/list?valor='+this.textoBusqueda,configuracion).then(function (response){
                    //console.log(me.articulos);
                    me.articulos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            getArrayPersonas(){
                let me = this;
                let proveedoresArray=[];
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('persona/listProveedores',configuracion).then(function (response){
                    proveedoresArray=response.data;
                    proveedoresArray.map(function(x){
                        me.personas.push({text:x.nombre, value: x._id});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            listar () {
                let me = this;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('ingreso/list', configuracion).then(function (response){
                    //console.log(response);
                    me.ingresos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this.editedItem = { 
                    _id: '',
                    persona: '',
                    tipo_comprobante: '',
                    serie_comprobante: '',
                    tipo_documento: '',
                    num_comprobante: '',
                    impuesto: 0.21,
                    total: 0,
                };
                this.detalles=[];
                this.totalIVA=0,
                this.totalNeto=0,
                this.valida=0;
                this.validaMensaje=[];
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.editedItem.persona){
                    this.validaMensaje.push('Seleccione un proveedor.');
                }
                if(!this.editedItem.tipo_comprobante){
                    this.validaMensaje.push('Seleccione un tipo de comprobante.');
                }
                if(!this.editedItem.num_comprobante){
                    this.validaMensaje.push('Ingrese el número del comprobante.');
                }
                if(!this.editedItem.impuesto || this.editedItem.impuesto<0 || this.editedItem.impuesto>1){
                    this.validaMensaje.push('Ingrese un impuesto válido.');
                }
                if(this.detalles.length<=0){
                    this.validaMensaje.push('Ingrese al menos un artículo al detalle');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            guardarIngreso(){
                let me = this;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                if (this.validar()){
                    return;
                }
                axios.post('ingreso/add', 
                        {
                            'persona':this.editedItem.persona,
                            'usuario':this.$store.state.usuario._id,
                            'tipo_comprobante': this.editedItem.tipo_comprobante,
                            'serie_comprobante': this.editedItem.serie_comprobante,
                            'num_comprobante':this.editedItem.num_comprobante,
                            'impuesto': this.editedItem.impuesto,
                            'total':this.editedItem.total,
                            'detalles':this.detalles
                        }
                        ,configuracion)
                    .then( response => {
                        console.log(response.data)
                        me.limpiar();
                        me.cierraNuevoIngreso();
                        me.listar();
                        return response;
                    }).catch(function(error){
                        console.log(error);
                    });
            },
            activarDesactivarMostrar(cod, item){
                this.adAction = cod ; 
                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item._id;
            },
            activarRegistro(){
                    let me = this;
                    let header = { "Token" : this.$store.state.token};
                    let configuracion = {headers: header};
                    axios.put('usuario/activate', {'_id':this.adId}, configuracion)
                        .then(function(response){
                        //console.log(response.data);
                        me.editedItem = Object.assign({}, response.data );
                        me.listar();
                        me.cerrarModalActDes();
                        me.adAction = 0;
                        me.adNombre = '';
                        me.adId = ''
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            desactivarRegistro(){
                    let me = this;
                    let header = { "Token" : this.$store.state.token};
                    let configuracion = {headers: header};
                    axios.put('usuario/deactivate', {'_id':this.adId}, configuracion)
                        .then(function(response){
                        //console.log(response.data);
                        me.editedItem = Object.assign({}, response.data );
                        me.listar();
                        me.cerrarModalActDes();
                        me.adAction = 0;
                        me.adNombre = '';
                        me.adId = ''
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            cerrarModalActDes(){
                this.adModal = 0 ;
            },
            close() {
                this.modalArticulos = false;
            },
            cierraNuevoIngreso(){
                this.nuevoIngreso = false;
            }
        }
    }
</script>

<style scoped>
.v-toolbar{
    box-shadow: none !important;
}
</style>
