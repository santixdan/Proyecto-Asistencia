<template>
  <div class="todo">
    <div class="q-pa-md">
      <q-table title="Aprendices" :rows="rows" :columns="columns" row-key="name">
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
      <q-btn label="Crear Aprendiz" color="green-8" @click="(icon = true), (change = false)" />
    </div>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="icon" persistent>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6" v-if="change == false">Crear Aprendiz</div>
            <div class="text-h6" v-else>Editar Aprendiz</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @reset="onReset()" class="q-gutter-md">
                <q-select filled type="number" v-model="ficha" :options="options" label="Ficha"
                  hint="Código de la ficha" emit-value map-options />
                <q-input filled v-model="name" label="Nombre" hint="Nombre del usuario" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el nombre del usuario'
                    } else { return true }
                  }
                ]" />
                <q-input filled type="number" v-model="cedula" label="Cédula" hint="Cédula del aprendiz" lazy-rules
                  :rules="[
                    (val) => {
                      if (change === false) {
                        return (val && val.length > 0) ||
                          'Por favor, dígite la cédula del aprendiz'
                      } else { return true }
                    }
                  ]" />
                <q-input filled type="number" v-model="telefono" label="Teléfono" hint="Teléfono del aprendiz"
                  lazy-rules :rules="[
                    (val) => {
                      if (change === false) {
                        return (val && val.length > 0) ||
                          'Por favor, dígite el teléfono del aprendiz'
                      } else { return true }
                    }
                  ]" />
                <q-input filled v-model="email" label="Correo" hint="Correo del aprendiz" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el correo del aprendiz'
                    } else { return true }
                  }
                ]" />
                <div>
                  <q-btn :loading="useAprendiz.loading" label="Guardar" type="submit" color="green-8"
                    @click="crear()" />
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
import { useAprendizStore } from '../stores/aprendices.js';
import { useFichaStore } from '../stores/fichas.js';

let useFicha = useFichaStore();
let useAprendiz = useAprendizStore()
let email = ref("");
let telefono = ref("");
let ficha = ref();
let cedula = ref("");
let codigo = ref()
let name = ref("");
let icon = ref(false);
let change = ref(); // false: crear, true: modificar
let idAprendiz = ref();
let options = ref()
let rows = ref([]);
let columns = ref([
  {
    name: "ficha1",
    align: "center",
    label: "Código de la ficha",
    field: "ficha",
  },
  {
    name: "cedula1",
    align: "center",
    label: "Cédula",
    field: "cedula",
  },
  {
    name: "nombre1",
    required: true,
    label: "Nombre del aprendiz",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "telefono1",
    align: "center",
    label: "Teléfono celular",
    field: "telefono",
  },
  {
    name: "correo1",
    align: "center",
    label: "Correo electrónico",
    field: "email",
  },
  { name: "estado1", align: "center", label: "Estado", field: "estado" },
  { name: "opciones", align: "center", label: "Opciones" },
]);

onBeforeMount(() => {
  traer()
  traerFichas()
})

async function traer() {
  let res = await useAprendiz.getListarAprendiz();
  let res2 = await useFicha.getListarFichas();
  rows.value = res.data.aprendices.map(aprendiz => {
    return {
      ...aprendiz,
      ficha: res2.data.fichas.find(ficha => ficha._id === aprendiz.ficha)?.codigo
    };
  })
}

async function activar(id) {
  let res = await useAprendiz.putActivarAprendiz(id)
  traer();
}

async function desactivar(id) {
  let res = await useAprendiz.putDesactivarAprendiz(id)
  traer();
}

async function traerId(id) {
  idAprendiz.value = id;
}

async function traerFichas() {
  let res = await useFicha.getListarFichas();
  options.value = res.data.fichas.map(ficha => ({
    label: ficha.codigo,
    value: ficha._id
  }));

}

async function crear() {
  let res;
  if (change.value === false) {
    res = await useAprendiz.postCrearAprendiz(ficha.value, cedula.value, name.value, telefono.value, email.value)
  }
  else {
    res = await useAprendiz.putModificarAprendiz(ficha.value, cedula.value, name.value, telefono.value, email.value, idAprendiz.value)
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
  email.value = ""
  telefono.value = ""
  ficha.value = ""
  cedula.value = ""
  name.value = ""
}
</script>