<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar color="white">
                <v-toolbar-title>Articulos</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    v-model="editedItem.codigo"  
                                    label="Código"
                                    :rules="[codigoRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-select 
                                    v-model="editedItem.categoria"
                                    :items="categorias"
                                    label="Categoria"
                                    :rules="[categoriaRule]"
                                >
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field 
                                    v-model="editedItem.nombre" 
                                    label="Nombre" 
                                    :rules="[nombreRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field 
                                    v-model="editedItem.descripcion" 
                                    label="Descripción" 
                                    :rules="[descripcionRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    type='number'
                                    v-model="editedItem.precio_venta" 
                                    label="Precio" 
                                    :rules="[precioRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    type='number'
                                    v-model="editedItem.stock" 
                                    label="Stock" 
                                    :rules="[stockRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 v-show="valida">
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                                </div>
                            </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>
            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" @click="close">Cancelar</v-btn>
                            <v-btn color="blue darken-1" @click="guardar">Guardar</v-btn>
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
                             el articulo {{adNombre}} ?
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
                :items="articulos"
                :search="search"
                class="elevation-1"
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
                        <td> {{ props.item.codigo }}</td>
                        <td> {{ props.item.nombre }}</td>
                        <td> {{ props.item.categoria.nombre }}</td>
                        <td> {{ props.item.stock }}</td>
                        <td> {{ props.item.precio_venta }}</td>
                        <td> {{ props.item.descripcion }}</td>
                        <td>
                            <div v-if="props.item.estado === 1">
                                <span blue--text>Activo</span>
                            </div>
                            <div v-if="props.item.estado === 0">
                                <span red--text>Inactivo</span>
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios';
    export default {
        data(){
            return{
                codigoRule: v  => {
                    if ( v == null || v.length <= 64 ) return true;
                    return 'Debe tener entre 1-50 caracteres';
                },
                nombreRule: v  => {
                    if ( v == null || (v && v.length >= 1 && v.length <= 50) ) return true;
                    return 'Debe tener máximo 20 caracteres';
                },
                categoriaRule: v  => {
                    if ( v.length <= 70 ) return true;
                    return 'Debe tener máximo 70 caracteres';
                },
                stockRule: v  => {
                    if (v > 0 ) return true;
                    return 'Es requerido';
                },
                precioRule: v  => {
                    if ( v > 0 ) return true;
                    return 'Es requerido';
                },
                descripcionRule: v  => {
                    if ((v && v.length <= 255) || v == null || v == '' ) return true;
                    return 'No debe exceder de 255 caracteres';
                },
                estadoRule: v  => {
                    if ( v == 0 || v == 1 || v == null ) return true;
                    return 'Estado tiene que ser 1 o 0';
                },
                dialog: false,
                search:'',
                articulos: [],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Código',value: 'codigo', sortable: false},
                    { text: 'Nombre',value: 'nombre', sortable: true},
                    { text: 'Categoría',value: 'categoria.nombre', sortable: true},
                    { text: 'Stock',value: 'stock', sortable: false},
                    { text: 'Precio Venta',value: 'precio_venta', sortable: false},
                    { text: 'Descripción', value: 'descripcion', sortable: false },              
                    { text: 'Estado', value: 'estado', sortable: false }
                ],
                editedIndex: -1,
                editedItem:  {
                    _id: '',
                    opciones:'',
                    categoria: '',
                    codigo: '',
                    nombre: '',
                    stock: 0,
                    precio_venta: 0,
                    descripcion: '',
                    estado: ''
                },
                categorias: [],
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAction:0,
                adNombre:'',
                adId:'',
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo Articulo' : 'Editar Articulo'
            }
        },
        watch: {
            dialog (val) {
                val || this.close()
            }
        },
        created () {
            this.getCategorias();
            this.listar();
        },
        methods: {
            getCategorias(){
                let me = this;
                let categoriaArray=[];
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('categoria/list',configuracion).then(function (response){
                    categoriaArray=response.data;
                    categoriaArray.map(function(x){
                        me.categorias.push({text:x.nombre, value:x._id});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            listar () {
                let me = this;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('articulo/list', configuracion).then(function (response){
                    //console.log(response);
                    me.articulos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this.editedItem = { 
                    _id: '',
                    opciones:'',
                    categoria: '',
                    codigo: '',
                    nombre: '',
                    stock: 0,
                    precio_venta: 0,
                    descripcion: '',
                    estado: ''
                };
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                console.log(this.editedItem);
                this.valida=0;
                this.validaMensaje=[];
                if (!this.editedItem.categoria){
                    this.validaMensaje.push('Seleccione una categoría');
                }
                if(this.editedItem.codigo){
                    if (this.editedItem.codigo.length>64){
                        this.validaMensaje.push('El código no debe tener más de 64 caracteres');
                    }
                }
                if( this.editedItem.nombre == null || this.editedItem.nombre.length<1 || this.editedItem.nombre.length>50){
                    this.validaMensaje.push('El nombre del artículo debe tener entre 1-50 caracteres.');
                }
                if(this.editedItem.descripcion){
                    if(this.editedItem.descripcion.length>255){
                        this.validaMensaje.push('La descripción del artículo no debe tener más de 255 caracteres.');
                    }
                }
                if (this.editedItem.stock<0){
                    this.validaMensaje.push('Ingrese un stock valido');
                }
                if (this.editedItem.precio_venta<0){
                    this.validaMensaje.push('Ingrese un precio de venta valido');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            guardar(){
                let me = this;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                if (this.validar()){
                    return;
                }
                if (this.editedIndex > -1) {
                    // Edita Articulo
                    axios.put('articulo/update',
                        {
                            '_id':this.editedItem._id,
                            'codigo':this.editedItem.codigo,
                            'categoria':this.editedItem.categoria,
                            'nombre':this.editedItem.nombre,
                            'descripcion':this.editedItem.descripcion,
                            'precio_venta':this.editedItem.precio_venta,
                            'stock':this.editedItem.stock
                        },
                        configuracion)
                        .then( response => {
                            console.log(response.data);
                            //me.editedItem = Object.assign({}, response.data );
                            me.limpiar();
                            me.close();
                            me.listar();
                            return response;
                        })
                        .catch(function(error){
                            console.log(error);
                        });
                } else {
                    // Guarda nueva Articulo
                    axios.post('articulo/add', 
                            {
                                'codigo':this.editedItem.codigo,
                                'categoria':this.editedItem.categoria,
                                'nombre':this.editedItem.nombre,
                                'descripcion':this.editedItem.descripcion,
                                'precio_venta':this.editedItem.precio_venta,
                                'stock':this.editedItem.stock
                            }
                            ,configuracion)
                        .then( response => {
                            console.log(response.data);
                            me.limpiar();
                            me.close();
                            me.listar();
                            return response;
                        }).catch(function(error){
                            console.log(error);
                        });
                }
            },
            editItem (item) {
                this.editedIndex = this.articulos.indexOf(item)
                //console.log(item)
                this.editedItem = Object.assign({}, item)
                // Necesitamos traer solo el _id para que aparezca seleccionado en la modal de Editar Artículo
                this.editedItem.categoria = item.categoria._id;
                //console.log(this.editedItem)
                this.dialog = true
            },
            activarDesactivarMostrar(cod, item){
                //console.log(cod);
                //console.log(item);
                this.adAction = cod ; 
                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item._id;
            },
            activarRegistro(){
                    let me = this;
                    let header = { "Token" : this.$store.state.token};
                    let configuracion = {headers: header};
                    axios.put('articulo/activate', {'_id':this.adId}, configuracion)
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
                    axios.put('articulo/deactivate', {'_id':this.adId}, configuracion)
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
            close () {
                this.limpiar();
                this.dialog = false
            }
        }
    }
</script>

<style scoped>
.v-toolbar{
    box-shadow: none !important;
}
</style>
