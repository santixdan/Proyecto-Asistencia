<template>
  <div class="todo">
    <h3 id="tituloPrincipal">Bitácoras</h3>
    <hr id="hr">
    <div class="q-pa-md">
      <div class="q-pa-md q-gutter-sm">
        <q-btn label="Crear Bitácora" color="green-8" @click="(icon = true), (change = false)" />
      </div>
      <q-table title="Bitácoras" :rows="rows" :columns="columns" row-key="name" :loading="useBitacora.loading">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-gutter-md row">
              <q-select filled v-model="model" label="Simple select" :options="option" style="width: 250px"
                behavior="menu" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="icon" persistent>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6" v-if="change == false">Crear Bitácora</div>
            <div class="text-h6" v-else>Editar Bitácora</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <q-select filled type="number" v-model="aprendiz" :options="options" label="Aprendiz" emit-value
                  map-options /><br>
                <q-input filled v-model="fecha">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="fecha" mask="YYYY-MM-DD HH:mm" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="fecha" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div>
                  <q-btn :loading="useBitacora.loading" label="Guardar" type="submit" color="green-8" />
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
import { useBitacoraStore } from '../stores/bitacoras.js';

let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let aprendiz = ref();
let fecha = ref();
let icon = ref(false);
let model = ref();
let option = ['Asistió', 'No asistió', 'Excusa', 'Pendiente']
let change = ref(); // false: crear, true: modificar
let idBitacora = ref();
let options = ref()
let rows = ref([]);
let columns = ref([
  {
    name: "aprendiz1",
    align: "center",
    label: "Cédula del aprendiz",
    field: "aprendiz",
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
  traerAprendices()
})

async function traer() {
  let res = await useBitacora.getListarBitacora();
  let res2 = await useAprendiz.getListarAprendiz();
  rows.value = res.data.bitacoras.map(bitacora => {
    return {
      ...bitacora,
      aprendiz: res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz)?.cedula
    };
  })
}

async function traerId(id) {
  idBitacora.value = id;
}

async function traerAprendices() {
  let res = await useAprendiz.getListarAprendiz();
  options.value = res.data.aprendices.map(aprendiz => ({
    label: aprendiz.cedula,
    value: aprendiz._id
  }));
}

async function crear() {
  let res;
  if (change.value === false) {
    res = await useBitacora.postCrearBitacora(aprendiz.value.trim(), fecha.value.trim())
  }
  else {
    res = await useBitacora.putModificarBitacora(aprendiz.value.trim(), fecha.value.trim(), idBitacora.value)
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
  fecha.value = ""
  aprendiz.value = ""
}
</script>
