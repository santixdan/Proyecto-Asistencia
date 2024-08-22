<template>
  <div class="todo">
    <div class="q-pa-md">
      <q-table title="Bitácoras" :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn label="📝" color="black" @click="(icon = true), (change = true), traerId(props.row._id)" />
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="q-pa-md q-gutter-sm">
      <q-btn label="Crear Bitácora" color="green-8" @click="(icon = true), (change = false)" />
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
              <q-form @reset="onReset()" class="q-gutter-md">
                <q-select filled type="number" v-model="aprendiz" :options="options" label="Aprendiz"
                  hint="Cédula del aprendiz"  emit-value map-options/>
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
import { useBitacoraStore } from '../stores/bitacoras.js';

let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let aprendiz = ref();
let fecha = ref();
let icon = ref(false);
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
  { name: "opciones", align: "center", label: "Opciones" },
]);

onBeforeMount(() => {
  traer()
  traerAprendices()
})

async function traer() {
  let res = await useBitacora.getListarBitacora();
  rows.value = res.data.bitacoras;
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
    res = await useBitacora.postCrearBitacora(aprendiz.value, fecha.value)
  }
  else {
    res = await useBitacora.putModificarBitacora(aprendiz.value, fecha.value, idBitacora.value)
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