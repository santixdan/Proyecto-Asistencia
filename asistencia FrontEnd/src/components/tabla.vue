<template>
  <div class="registro-asistencia">
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
          <th colspan="11" style="text-align: center;">
            <span style="margin-right: 50px;">REGISTRO DE ASISTENCIA Y APROBACIÓN DEL ACTA No-</span><span>DEL DÍA <u>{{
              day }}</u> DEL MES DE <u>{{ month }}</u> DEL AÑO <u>{{ year }}</u></span>
          </th>
        </tr>
        <tr>
          <th colspan="2" style="text-align: center; ">
            OBJETIVO (S)
          </th>
          <th colspan="10">
            <span>Registro de asistencia de la ficha {{ ficha }}</span>
          </th>
        </tr>
        <tr>
          <th>
            <p>No.</p>
          </th>
          <th>
            <p>Nombres y Apellidos</p>
          </th>
          <th>
            <p>No. Documento</p>
          </th>
          <th>
            <p>Planta</p>
          </th>
          <th>
            <p>Contratista</p>
          </th>
          <th>
            Otro<br>¿Cuál?
          </th>
          <th>
            Dependencia/<br>Empresa
          </th>
          <th>
            <p>Correo Electrónico</p>
          </th>
          <th>
            <p>Teléfono/Ext. SENA</p>
          </th>
          <th>
            Autoriza<br>Grabación
          </th>
          <th>
            Firma o Participación<br>Virtual
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="row.id">
          <td>
            <p>{{ index + 1 }}</p>
          </td>
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
            <p>{{ row.otro ? 'Sí' : 'Aprendiz' }}</p>
          </td>
          <td>
            <p>{{ row.dependencia ? 'Sí' : 'SENA/CAT' }}</p>
          </td>
          <td>
            <p>{{ row.correo }}</p>
          </td>
          <td>
            <p>{{ row.telefono }}</p>
          </td>
          <td>
            <p>{{ row.autorizaGrabacion }}</p>
          </td>
          <td>
            <img :src="row.firma" alt="firma del aprendiz" style="height: 35px; ">
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
import { useFichaStore } from '../stores/fichas.js';

let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let useFicha = useFichaStore();
let ficha;
let day = ref('');
let month = ref('');
let year = ref('');
let rows = ref([]);
let loading = ref(true);

function obtenerFechaActual() {
  let fechaObj = new Date(useBitacora.fechaBitacora);
  day.value = fechaObj.getDate();
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  month.value = meses[fechaObj.getMonth()];
  year.value = fechaObj.getFullYear();
}

async function traer() {
  try {
    let res = await useBitacora.getListarBitacoraPorFechaYFichaYEstado();
    let res2 = await useAprendiz.getListarAprendiz();
    let res3 = await useFicha.getListarFichas();
    ficha = res3.data.fichas.find(ficha => ficha._id === useBitacora.fichaBitacora)?.codigo

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
        autorizaGrabacion: bitacora.autorizaGrabacion || '',
        firma: aprendiz.firma || '',
      };
    });

    while (rows.value.length < 12) {
      rows.value.push({
        nombre: '',
        cedula: '',
        planta: '',
        contratista: '',
        otro: '',
        dependencia: '',
        correo: '',
        telefono: '',
        autorizaGrabacion: '',
        firma: '',
      });
    }
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
  margin: 5px;
  display: flex;
  justify-content: center;
}

table {
  width: 90%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #000;
  padding: 2px;
  /* text-align: center; */
  font-size: 12px;
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
