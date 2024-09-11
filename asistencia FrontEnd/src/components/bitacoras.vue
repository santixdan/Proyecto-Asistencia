<template>
  <div class="todo">
    <h3 id="tituloPrincipal">Bitácoras</h3>
    <hr id="hr" class="bg-green-9">
    <div class="q-pa-md">
      <div class="q-pa-md q-gutter-sm">
        <q-btn push label="Crear Bitácora" color="green-9" @click="(icon = true)" />
        <q-btn push style="float: right;" round color="green-9" icon="print" to="/tabla" target="_blank"/>
        <a href="" target="_blank"></a>
      </div>
      <q-table title="Bitácoras" :rows="rows" :columns="columns" row-key="name" :loading="useBitacora.loading">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md" align="center">
              <q-select filled v-model="props.row.estado" label="Estado" style="max-width: 300px;"
                :options="optionsEstado" emit-value map-options :loading="loadingButtons[props.row._id]"
                @update:model-value="updateEstado($event, props.row._id)" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="icon" persistent>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Crear Bitácora</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <q-select filled type="number" v-model="aprendiz" use-input input-debounce="0" label="Aprendiz"
                  :options="options" @filter="filterFn" style="width: 250px" behavior="menu" emit-value map-options
                  lazy-rules :rules="[val => (val && val.length > 0) || 'Por favor, dígite la cédila del aprendiz']">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input filled v-model="fecha" label="Fecha" mask="date" lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Por favor, dígite la fecha de la bitácora']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fecha" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div>
                  <q-btn push :loading="useBitacora.loading" label="Guardar" type="submit" color="green-9" />
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRightFromBracket, faPenToSquare, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Notify } from 'quasar'
import { onBeforeMount, ref } from "vue";
import { useAprendizStore } from '../stores/aprendices.js';
import { useBitacoraStore } from '../stores/bitacoras.js';

library.add(faArrowRightFromBracket, faPenToSquare, faCheck, faXmark);
let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let aprendiz = ref();
let fecha = ref();
let icon = ref(false);
let optionsEstado = ['Asistió', 'No asistió', 'Excusa']
//let change = ref(false); false: crear, true: modificar
let options = ref()
let loadingButtons = ref({});
let rows = ref([]);
let columns = ref([
  {
    name: "aprendiz1",
    align: "center",
    label: "Cédula del aprendiz",
    field: "aprendiz",
  },
  {
    name: "aprendiznombre1",
    align: "center",
    label: "Nombre del aprendiz",
    field: "aprendiznombre",
    sortable: true,
  },
  {
    name: "fecha1",
    align: "center",
    label: "Fecha de la bitácora",
    field: "fecha",
  },
  { name: "opciones", align: "center", label: "Opciones" }
]);

onBeforeMount(() => {
  traer()
  // traerAprendices()
})

async function updateEstado(estado, id) {
  loadingButtons.value[id] = true;
  let res = await useBitacora.putModificarBitacora(estado, id);
  if (useBitacora.loading == false) {
    loadingButtons.value[id] = false;
  }
  if (res.validar.value === true) {
    traer();
  } else {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Error en la petición",
      timeout: 2500,
    });
  }




}

async function traer() {
  let res = await useBitacora.getListarBitacora();
  let res2 = await useAprendiz.getListarAprendiz();
  rows.value = res.data.bitacora.map(bitacora => {
    return {
      ...bitacora,
      aprendiz: res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz)?.cedula,
      aprendiznombre: res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz)?.nombre
    };
  })
}

const filterFn = async (val, update) => {
  let res = await useAprendiz.getListarAprendiz();
  const aprendicesActivos = res.data.aprendices.filter(aprendiz => aprendiz.estado === 1);

  if (val === '') {
    update(() => {
      options.value = aprendicesActivos.map(aprendiz => ({
        label: aprendiz.cedula,
        value: aprendiz._id
      }));
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = aprendicesActivos
      .map(aprendiz => ({
        label: aprendiz.cedula,
        value: aprendiz._id
      }))
      .filter(option => option.label.toLowerCase().includes(needle));
  });
}


// async function traerAprendices() {
//   let res = await useAprendiz.getListarAprendiz();
//   options.value = res.data.aprendices.map(aprendiz => ({
//     label: aprendiz.cedula,
//     value: aprendiz._id
//   }));
// }

async function crear() {
  let res = await useBitacora.postCrearBitacora1(aprendiz.value.trim(), fecha.value.trim())
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
  fecha.value = ""
  aprendiz.value = ""
}

</script>
