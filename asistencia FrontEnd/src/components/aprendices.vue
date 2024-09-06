<template>
  <div class="todo">
    <h3 id="tituloPrincipal">Aprendices</h3>
    <hr id="hr" class="bg-green-9">
    <div class="q-pa-md">
      <div class="q-pa-md q-gutter-sm">
        <q-btn label="Crear Aprendiz" color="green-9" @click="(icon = true), (change = false)" />
      </div>
      <q-table title="Aprendices" :rows="rows" :columns="columns" row-key="name" :loading="useAprendiz.loading">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn label="📝" @click="(icon = true), (change = true), traerId(props.row._id)" />
              <q-btn v-if="props.row.estado == 0" @click="activar(props.row._id)"
                :loading="loadingButtons[props.row._id]">✅</q-btn>
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
            <div class="text-h6" v-if="change == false">Crear Aprendiz</div>
            <div class="text-h6" v-else>Editar Aprendiz</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="onReset()"/>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <!-- <q-select filled type="number" v-model="ficha" :options="options" label="Ficha" emit-value
                  map-options /> -->
                <q-select filled type="number" v-model="ficha" use-input input-debounce="0" label="Ficha"
                  :options="options" @filter="filterFn" style="width: 250px" behavior="menu" emit-value map-options
                  lazy-rules :rules="[
                    (val) => {
                      if (change === false) {
                        return (val && val.length > 0) ||
                          'Por favor, dígite el código de la ficha'
                      } else { return true }
                    }
                  ]">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input filled v-model="name" label="Nombre" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el nombre del aprendiz'
                    } else { return true }
                  }
                ]" />
                <q-input filled type="number" v-model="cedula" label="Cédula" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite la cédula del aprendiz'
                    } else { return true }
                  }
                ]" />
                <q-input filled type="number" v-model="telefono" label="Teléfono" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el teléfono del aprendiz'
                    } else { return true }
                  }
                ]" />
                <q-input filled v-model="email" label="Correo" lazy-rules :rules="[
                  (val) => {
                    if (change === false) {
                      return (val && val.length > 0) ||
                        'Por favor, dígite el correo del aprendiz'
                    } else { return true }
                  }
                ]" />
                <div>
                  <q-btn :loading="useAprendiz.loading" label="Guardar" type="submit" color="9" />
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
let name = ref("");
let icon = ref(false);
let change = ref(); // false: crear, true: modificar
let idAprendiz = ref();
let loadingButtons = ref({});
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
    name: "fichanombre1",
    align: "center",
    label: "Nombre de la ficha",
    field: "fichanombre",
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
      ficha: res2.data.fichas.find(ficha => ficha._id === aprendiz.ficha)?.codigo,
      fichanombre: res2.data.fichas.find(ficha => ficha._id === aprendiz.ficha)?.nombre
    };
  })
}

const filterFn = async (val, update) => {
  let res = await useFicha.getListarFichas();
  if (val === '') {
    update(() => {
      options.value = res.data.fichas.map(ficha => ({
        label: ficha.codigo,
        value: ficha._id
      }));
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = res.data.fichas.map(ficha => ({
      label: ficha.codigo,
      value: ficha._id
    })).filter(option => option.label.toLowerCase().includes(needle));
  });
}

async function activar(id) {
  loadingButtons.value[id] = true;
  let res = await useAprendiz.putActivarAprendiz(id)
  if (useAprendiz.loading == false) {
    loadingButtons.value[id] = false;
  }
  traer();
}

async function desactivar(id) {
  loadingButtons.value[id] = true;
  let res = await useAprendiz.putDesactivarAprendiz(id)
  if (useAprendiz.loading == false) {
    loadingButtons.value[id] = false;
  }
  traer();
}

async function traerId(id) {
  let aprendiz = rows.value.find(apprentice => apprentice._id === id);
  email.value = aprendiz.email
  telefono.value = aprendiz.telefono
  // ficha.value = aprendiz.ficha
  cedula.value = aprendiz.cedula
  name.value = aprendiz.nombre
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
    res = await useAprendiz.postCrearAprendiz(ficha.value.trim(), cedula.value.trim(), name.value.trim(), telefono.value.trim(), email.value.trim())
  }
  else {
    res = await useAprendiz.putModificarAprendiz(ficha.value, cedula.value, name.value, telefono.value, email.value, idAprendiz.value)
  }
  if (res.validar.value === true) {
    icon.value = false
    onReset()
    traer();
    Notify.create({
      color: "green-6",
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
