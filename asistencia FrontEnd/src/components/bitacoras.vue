<template>
  <div class="todo">
    <h3 id="tituloPrincipal">Bitácoras</h3>
    <hr id="hr" class="bg-green-9">
    <div class="q-pa-md">
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
  </div>
</template>

<script setup>
import { Notify } from 'quasar'
import { onBeforeMount, ref } from "vue";
import { useAprendizStore } from '../stores/aprendices.js';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useFichaStore } from '../stores/fichas.js';

let useFicha = useFichaStore();
let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let optionsEstado = ['Asistió', 'No asistió', 'Excusa']
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
    sortable: true,
  },
  {
    name: "fecha1",
    align: "center",
    label: "Fecha de la bitácora",
    field: "fecha"
  },
  { name: "opciones", align: "center", label: "Opciones" }
]);

onBeforeMount(() => {
  traer()
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
  let res3 = await useFicha.getListarFichas()
  if (res.data.bitacora.length === 0) {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "No hay registros con esas especificaciones",
      timeout: 2500,
    });
  } else {
    rows.value = res.data.bitacora.map(bitacora => {
      let aprendices = res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz)
      let fichas = res3.data.fichas.find(ficha => ficha._id === aprendices.ficha)
      return {
        ...bitacora,
        fecha: formatFecha(bitacora.fecha),
        aprendiz: aprendices.cedula,
        aprendiznombre: aprendices.nombre,
        ficha: fichas.codigo,
        fichanombre: fichas.nombre
      };
    })
  }
}

function formatFecha(fecha) {
  const date = new Date(fecha);
  const offset = date.getTimezoneOffset(); // obtén el offset en minutos
  date.setMinutes(date.getMinutes() + offset); // ajusta la fecha
  
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("es-ES", options);
}

</script>
