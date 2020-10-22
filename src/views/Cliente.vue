<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar color="white">
                <v-toolbar-title>Clientes</v-toolbar-title>
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
                                    v-model="editedItem.nombre"  
                                    label="Nombre"
                                    :rules="[nombreRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-select 
                                    v-model="editedItem.tipo_documento"
                                    :items="documentos"
                                    label="Tipo de Documento"
                                    :rules="[docRule]"
                                >
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    v-model="editedItem.num_documento" 
                                    label="Número Documento" 
                                    :rules="[docRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    v-model="editedItem.direccion" 
                                    label="Dirección" 
                                    :rules="[direccionRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    v-model="editedItem.telefono" 
                                    label="Teléfono" 
                                    :rules="[docRule]"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    v-model="editedItem.email" 
                                    label="Email" 
                                    :rules="[emailRule]"
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
                            Activar Cliente
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAction==2">
                            Desactivar Cliente
                        </v-card-title>
                        <v-card-text>
                            ¿Está seguro de que quieres 
                            <span v-if="adAction==1">activar</span>
                            <span v-if="adAction==2">desactivar</span>
                             el cliente {{adNombre}} ?
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
                :items="personas"
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
                        <td> {{ props.item.tipo_persona }}</td>
                        <td> {{ props.item.tipo_documento }}</td>
                        <td> {{ props.item.num_documento }}</td>
                        <td> {{ props.item.direccion }}</td>
                        <td> {{ props.item.telefono }}</td>
                        <td> {{ props.item.email }}</td>
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
                nombreRule: v  => {
                    if ( v == null || (v && v.length >= 1 && v.length <= 50) ) return true;
                    return 'Debe tener entre 1-50 caracteres';
                },
                docRule: v  => {
                    if ( v == null || v.length <= 20 ) return true;
                    return 'Debe tener máximo 20 caracteres';
                },
                direccionRule: v  => {
                    if ( v == null || v.length <= 70 ) return true;
                    return 'Debe tener máximo 70 caracteres';
                },
                emailRule: v  => {
                    if (v == null || (v && v.length >= 1 && v.length <= 50) ) return true;
                    return 'Es requerido (MAX: 50 caracteres)';
                },
                dialog: false,
                search:'',
                personas: [],
                headers: [
                    { text: 'Opciones', value: '', sortable: true},
                    { text: 'Nombre', value: 'nombre', sortable: true},
                    { text: 'Tipo Persona', value: 'tipo_persona', sortable: true},
                    { text: 'Tipo Documento', value: 'tipo_documento', sortable: true},
                    { text: 'Num Documento', value: 'num_documento', sortable: false},
                    { text: 'Dirección', value: 'direccion', sortable: false},
                    { text: 'Teléfono', value: 'telefono', sortable: false},
                    { text: 'Email', value: 'email', sortable: false},
                    { text: 'Estado', value: 'estado', sortable: false},
                ],
                editedIndex: -1,
                editedItem:
                    {
                        _id: '',
                        nombre:'',
                        tipo_persona: 'Cliente',
                        tipo_documento: '',
                        num_documento: '',
                        direccion: '',
                        email: '',
                        telefono: ''
                    },
                documentos: ['DNI','NIF'],
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
                return this.editedIndex === -1 ? 'Nuevo Cliente' : 'Editar Cliente'
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
                axios.get('persona/listClientes', configuracion).then(function (response){
                    //console.log(response);
                    me.personas = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this.editedItem = [{ 
                    _id: '',
                    nombre:'',
                    tipo_persona:'Cliente',
                    num_documento:'',
                    tipo_documento: '',
                    direccion:'',
                    telefono:'',
                    email:''
                }];
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(this.editedItem.nombre == null || this.editedItem.nombre.length<1 || this.editedItem.nombre.length>50){
                    this.validaMensaje.push('El nombre del usuario debe tener entre 1-50 caracteres.');
                }
                if(this.editedItem.num_documento) {
                    if(this.editedItem.num_documento.length>20){
                        this.validaMensaje.push('El documento no debe tener más de 20 caracteres.');
                    }
                }
                if(this.editedItem.direccion){
                    if(this.editedItem.direccion.length>70){
                        this.validaMensaje.push('La dirección no debe tener más de 70 caracteres.');
                    }
                }
                if(this.editedItem.telefono){
                    if(this.editedItem.telefono.length>20){
                        this.validaMensaje.push('El teléfono no debe tener más de 20 caracteres.');
                    }
                }
                if(this.editedItem.email){
                    if(this.editedItem.nombre.length>50){
                        this.validaMensaje.push('El email del usuario debe tener más de 50 caracteres.');
                    }
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
                    // Edita Cliente
                    axios.put('persona/update',
                        {   
                            '_id':this.editedItem._id,
                            'tipo_persona':this.editedItem.tipo_persona,
                            'nombre':this.editedItem.nombre,
                            'tipo_documento':this.editedItem.tipo_documento,
                            'num_documento':this.editedItem.num_documento,
                            'direccion':this.editedItem.direccion,
                            'telefono': this.editedItem.telefono,
                            'email':this.editedItem.email,
                        },
                        configuracion)
                        .then( response => {
                            //console.log(response.data);
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
                    // Guarda nuevo Cliente
                    axios.post('persona/add', 
                            {
                                'tipo_persona':this.editedItem.tipo_persona,
                                'nombre':this.editedItem.nombre,
                                'tipo_documento':this.editedItem.tipo_documento,
                                'num_documento':this.editedItem.num_documento,
                                'direccion':this.editedItem.direccion,
                                'telefono': this.editedItem.telefono,
                                'email':this.editedItem.email,
                            }
                            ,configuracion)
                        .then( response => {
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
                this.editedIndex = this.personas.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.editedItem.tipo_persona = 'Cliente';
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
                    axios.put('persona/activate', {'_id':this.adId}, configuracion)
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
                    axios.put('persona/deactivate', {'_id':this.adId}, configuracion)
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
