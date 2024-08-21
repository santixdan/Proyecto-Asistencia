<template>
  <div class="todo">
    <div class="q-pa-md">
      <q-table title="Bitacoras" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn label="📝" color="black" @click="(icon = true), (change = true), traerId(props.row._id)" />
            <q-btn v-if="props.row.estado == 0" @click="activar(props.row._id)">✅</q-btn>
            <q-btn v-else @click="desactivar(props.row._id)">❌</q-btn>
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
      <q-btn label="Crear Bitacora" color="green-8" @click="(icon = true), (change = false)" />
    </div>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="icon" persistent>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6" v-if="change == false">Crear Bitacora</div>
            <div class="text-h6" v-else>Editar Bitacora</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @reset="onReset()" class="q-gutter-md">
                <q-input filled type="number" v-model="code" label="Código" hint="Código de la bitacora" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el código de la bitacora'
                    } else { return true }
                  }
                ]" />
                <q-input filled v-model="name" label="Nombre" hint="Nombre de la bitacora" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el nombre de la bitacora'
                    } else { return true }
                  }
                ]" />
                <div>
                  <q-btn :loading="useFicha.loading" label="Guardar" type="submit" color="green-8" @click="crear()" />
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
import { useBitacoraStore } from '../stores/bitacoras.js';

let useBitacora = useBitacoraStore();
let code = ref("");
let name = ref("");
let icon = ref(false);
let change = ref(); // false: crear, true: modificar
let idFicha = ref();
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
  let res = await useBitacora.getListarBitacora();
  rows.value = res.data.fichas;
}

async function activar(id) {
  let res = await useBitacora.putActivarBitacora(id);
  traer();
}

async function desactivar(id) {
  let res = await useBitacora.putDesactivarBitacora(id);
  traer();
}

async function traerId(id) {
  idFicha.value = id;
}

async function crear() {
  let res;
  if (change.value === false) {
    res = await useBitacora.postCrearBitacora(code.value, name.value);
  }
  else {
    res = await useBitacora.putModificarBitacora(code.value, name.value, idFicha.value);
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