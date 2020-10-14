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
                            <v-text-field v-model="editedItem.nombre"  label="Nombre"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.descripcion"  label="Descripcion"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                            <v-text-field v-model="editedItem.estado" label="Estado"></v-text-field>
                        </v-flex>
                        </v-layout>
                    </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" @click="save">Guardar</v-btn>
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
                            <v-icon class="mr-2" @click="deleteItem(props.item)">delete</v-icon>
                            <v-icon @click="editItem(props.item)">edit</v-icon>
                        </td>
                        <td> {{ props.item.nombre }}</td>
                        <td>{{ props.item.descripcion }}</td>
                        <td>
                            <div v-if="props.item.estado">
                                <span>Activo</span>
                            </div>
                            <div v-else>
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
                        estado: ''
                    }
                ],
                
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            //this.initialize()
            this.listar();
        },
        methods: {
            listar () {
                let me = this;
                axios.get('categoria/list').then(function (response){
                    //console.log(response);
                    me.categorias = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.editedIndex = this.categorias.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem (item) {
                const index = this.categorias.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.categorias.splice(index, 1)
                console.log(item);
            },
            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            save () {
                if (this.editedIndex > -1) {
                    // Edita Categoria
                    console.log('Editar')
                    Object.assign(this.categorias[this.editedIndex], this.editedItem)
                } else {
                    // Añade nueva Categoria
                    console.log('Añadir Nuevo')
                    this.categorias.push(this.editedItem)
                }
                this.close()
            }
        }
    }
</script>

<style scoped>
.v-toolbar{
    box-shadow: none !important;
}
</style>
