<template>
  <div class="registro-asistencia">
    <h2>REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-</h2>
    <div class="info">
      <span> {{ day }} de {{ month }} del año {{ year }}</span>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="loading-container">
      <p>Cargando datos...</p>
    </div>

    <!-- Mensaje si no hay datos -->
    <div v-if="!loading && rows.length === 0" class="no-data-message">
      <p>No hay datos disponibles en este momento.</p>
    </div>

    <!-- Tabla de asistencia -->
    <table v-if="!loading && rows.length > 0">
      <thead>
        <tr>
          <th>No.</th>
          <th>Nombres y Apellidos</th>
          <th>No. Documento</th>
          <th>Planta</th>
          <th>Contratista</th>
          <th>Otro ¿Cuál?</th>
          <th>Dependencia/Empresa</th>
          <th>Correo Electrónico</th>
          <th>Teléfono/Ext. SENA</th>
          <th>Autoriza Grabación</th>
          <th>Firma o Participación Virtual</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="row.id">
          <td>{{ index + 1 }}</td>
          <td>
            <p>{{ row.nombre }}</p>
          </td>
          <td>
            <p>{{ row.cedula }}</p>
          </td>
          <td>
            <p>{{ row.planta }}</p>
          </td>
          <td>
            <p>{{ row.contratista }}</p>
          </td>
          <td>
            <p>{{ row.otro }}</p>
          </td>
          <td>
            <p>{{ row.dependencia }}</p>
          </td>
          <td>
            <p>{{ row.correo }}</p>
          </td>
          <td>
            <p>{{ row.telefono }}</p>
          </td>
          <td>
            <p>{{ row.autorizaGrabacion ? 'Sí' : 'No' }}</p>
          </td>
          <td>
            <p>{{ row.firma }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useAprendizStore } from '../stores/aprendices.js';
import { useBitacoraStore } from '../stores/bitacoras.js';

let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let day = ref('');
let month = ref('');
let year = ref('');
let rows = ref([]);
let loading = ref(true);

function obtenerFechaActual() {
  let fechaObj = new Date(useBitacora.fechaBitacora);
  day.value = fechaObj.getDate();
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  month.value = meses[fechaObj.getMonth()];
  year.value = fechaObj.getFullYear();
}

async function traer() {
  try {
    let res = await useBitacora.getListarBitacoraPorFechaYFichaYEstado();
    let res2 = await useAprendiz.getListarAprendiz();

    rows.value = res.r.data.bitacoras.map(bitacora => {
      let aprendiz = res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz);
      return {
        nombre: aprendiz?.nombre || '',
        cedula: aprendiz?.cedula || '',
        planta: bitacora.planta || '',
        contratista: bitacora.contratista || '',
        otro: bitacora.otro || '',
        dependencia: bitacora.dependencia || '',
        correo: aprendiz.email || '',
        telefono: aprendiz.telefono || '',
        autorizaGrabacion: bitacora.autorizaGrabacion || false,
        firma: bitacora.firma || '',
      };
    });
  } catch (error) {
    console.error('Error al traer los datos', error);
  } finally {
    loading.value = false; // Detener la carga una vez obtenidos los datos
  }
}

onBeforeMount(() => {
  traer();
  obtenerFechaActual();
});
</script>

<style scoped>
.registro-asistencia {
  text-align: center;
  margin: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #000;
  padding: 10px;
  text-align: center;
}

input[type="text"] {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

.loading-container {
  text-align: center;
  margin-top: 20px;
}

.no-data-message {
  text-align: center;
  color: red;
  font-weight: bold;
  margin-top: 20px;
}
</style>