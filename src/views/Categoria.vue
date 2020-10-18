<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
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
                            <v-flex xs12 sm6 md4>
                                <v-text-field 
                                    v-model="editedItem.nombre"  
                                    label="Nombre"
                                    :rules="[nombreRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field 
                                    v-model="editedItem.descripcion"  
                                    label="Descripcion"
                                    :rules="[descripcionRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field 
                                    v-model.number="editedItem.estado" 
                                    label="Estado" 
                                    type="number"
                                    :rules="[estadoRule]"
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
                             el registro {{editedItem.nombre}} ?
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
                :items="categorias"
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
                        <td> {{ props.item.nombre }}</td>
                        <td>{{ props.item.descripcion }}</td>
                        <td>
                            <div v-if="props.item.estado === 1">
                                <span>Activo</span>
                            </div>
                            <div v-if="props.item.estado === 0">
                                <span>Inactivo</span>
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
                nombreRule: v  => {
                    if ((v && v.length >= 1 && v.length <= 50) || v == null ) return true;
                    return 'Debe tener entre 1-50 caracteres';
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
                categorias: [],
                headers: [
                    { text: 'Opciones', value: '', sortable: false},
                    { text: 'Nombre', value: 'nombre', sortable: true},
                    { text: 'Descripción', value: 'descripcion', sortable: false},
                    { text: 'Estado', value: 'estado', sortable: false},
                ],
                editedIndex: -1,
                editedItem: [
                    {
                        _id: '',
                        nombre: '',
                        descripcion: '',
                        estado: Number,
                    }
                ],
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAction:0,
                adNombre:'',
                adId:''
                
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar();
        },
        methods: {
            listar () {
                let me = this;
                let header = { "Token" : this.$store.state.token};
                let configuracion = {headers: header};
                axios.get('categoria/list', configuracion).then(function (response){
                    //console.log(response);
                    me.categorias = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this.editedItem = { _id: null , nombre: null, descripcion: null, estado: null };
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if( this.editedItem.nombre == null || this.editedItem.nombre.length<1 || this.editedItem.nombre.length>50){
                    this.validaMensaje.push('El nombre de la categoría debe tener entre 1-50 caracteres.');
                }
                if(this.editedItem.descripcion == null) this.editedItem.descripcion = '';
                if(this.editedItem.descripcion.length>255){
                     this.validaMensaje.push('La descripción de la categoría no debe tener más de 255 caracteres.');
                }
                if(this.editedItem.estado == null || this.editedItem.estado == '') this.editedItem.estado = 1;
                if(this.editedItem.estado < 0 || this.editedItem.estado > 1){
                    this.validaMensaje.push('El estado debe ser 0 o 1');
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
                    // Edita Categoria
                    // Object.assign(this.categorias[this.editedIndex], this.editedItem)
                    axios.put('categoria/update',{'_id':this.editedItem._id,'nombre':this.editedItem.nombre,'descripcion':this.editedItem.descripcion, 'estado': this.editedItem.estado},configuracion)
                        .then(function(response){
                            console.log(response.data);
                            me.editedItem = Object.assign({}, response.data );
                            me.limpiar();
                            me.close();
                            me.listar();
                        })
                        .catch(function(error){
                            console.log(error);
                        });
                } else {
                    // Guarda nueva Categoria
                    axios.post('categoria/add', {'nombre': this.editedItem.nombre, 'descripcion': this.editedItem.descripcion, 'estado': this.editedItem.estado},configuracion)
                        .then( function(response){
                            console.log(response.data);
                            me.editedItem = Object.assign({}, response.data );
                            me.limpiar();
                            me.close();
                            me.listar();
                        }).catch(function(error){
                            console.log(error);
                        });
                }
            },
            editItem (item) {
                this.editedIndex = this.categorias.indexOf(item)
                this.editedItem = Object.assign({}, item)
                console.log(this.editedItem)
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
                    axios.put('categoria/activate', {'_id':this.adId}, configuracion)
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
                    axios.put('categoria/deactivate', {'_id':this.adId}, configuracion)
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
