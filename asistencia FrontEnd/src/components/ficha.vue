<template>
  
  <div class="todo">
    <h3 id="tituloPrincipal">Fichas</h3> 
    <hr id="hr">
    <div class="q-pa-md">
      <div class="q-pa-md q-gutter-sm">
        <q-btn label="Crear Ficha" color="green-8" @click="(icon = true), (change = false)" />
      </div>
      <q-table title="Fichas" :rows="rows" :columns="columns" row-key="name" :loading="useFicha.loading">

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn label="📝" @click="(icon = true), (change = true), traerId(props.row._id)" />
              <q-btn v-if="props.row.estado == 0" @click="activar(props.row._id)" :loading="loadingButtons[props.row._id]">✅</q-btn>
              <q-btn v-else @click="desactivar(props.row._id)" :loading="loadingButtons[props.row._id]">❌</q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-estado1="props">
          <q-td :props="props">
            <p style="color: green" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red" v-else>Inactivo</p>
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="icon" persistent>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6" v-if="change == false">Crear Ficha</div>
            <div class="text-h6" v-else>Editar Ficha</div>
            
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <q-input filled type="number" v-model="code" label="Código" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el código de la ficha'
                    } else { return true }
                  }
                ]" />
                <q-input filled v-model="name" label="Nombre" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el nombre de la ficha'
                    } else { return true }
                  }
                ]" />
                <div>
                  <q-btn :loading="useFicha.loading" label="Guardar" type="submit" color="green-8" />
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { Notify } from 'quasar'
import { onBeforeMount, ref } from "vue";
import { useFichaStore } from '../stores/fichas.js';

let useFicha = useFichaStore();
let code = ref("");
let name = ref("");
let icon = ref(false);
let change = ref(); // false: crear, true: modificar
let idFicha = ref();
let loadingButtons = ref({});
let rows = ref([]);
let columns = ref([
  {
    name: "nombre1",
    required: true,
    label: "Nombre de la ficha",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "codigo1",
    align: "center",
    label: "Código de la ficha",
    field: "codigo",
  },
  { name: "estado1", align: "center", label: "Estado", field: "estado" },
  { name: "opciones", align: "center", label: "Opciones" },
]);

onBeforeMount(() => {
  traer();
});

async function traer() {
  let res = await useFicha.getListarFichas();
  rows.value = res.data.fichas;
}

async function activar(id) {
  loadingButtons.value[id] = true;
  let res = await useFicha.putActivarFicha(id);
  if (useFicha.loading == false) {
    loadingButtons.value[id] = false;
  }
  traer();
}

async function desactivar(id) {
  loadingButtons.value[id] = true;
  let res = await useFicha.putDesactivarFicha(id);
  if (useFicha.loading == false) {
    loadingButtons.value[id] = false;
  }
  traer();
}

async function traerId(id) {
  idFicha.value = id;
}

async function crear() {
  let res;
  if (change.value === false) {
    res = await useFicha.postCrearFicha(code.value.trim(), name.value.trim());
  }
  else {
    res = await useFicha.putModificarFicha(code.value.trim(), name.value.trim(), idFicha.value);
  }
  if (res.validar.value === true) {
    icon.value = false
    onReset()
    traer();
    Notify.create({
      color: "green-3",
      message: "Registro exitoso",
      icon: "cloud_done",
      timeout: 2500,
    });
  } else {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: res.error.response.data.errors[0].msg,
      timeout: 2500,
    });
  }
}

function onReset() {
  name.value = "";
  code.value = "";
}
</script>
