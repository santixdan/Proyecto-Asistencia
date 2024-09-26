<template>
    <div class="todo">
        <h3 id="tituloPrincipal">Informes</h3>
        <hr id="hr" class="bg-green-9">
        <div class="q-pa-md">
            <div class="q-pa-md q-gutter-sm">
                <q-form @submit="traer()" @reset="onReset" class="q-gutter-md">
                    <q-input filled v-model="fecha" label="Fecha" mask="date" lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Por favor, dígite la fecha de la bitácora']">
                        <template v-slot:prepend>
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
                    <q-select filled type="number" v-model="ficha" use-input input-debounce="0" label="Ficha"
                        :options="options" @filter="filterFn" behavior="menu" emit-value map-options lazy-rules
                        :rules="[val => val && val.length > 0 || 'Por favor, dígite el código de la ficha']">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    No results
                                </q-item-section>
                            </q-item>
                        </template>
                        <template v-slot:prepend>
                    <font-awesome-icon icon="users-between-lines" />
                  </template>
                    </q-select>
                    <q-btn push label="Buscar" color="green-9" type="submit" />
                    <q-btn push style="float: right;" round color="green-9" icon="print" to="/tabla" target="_blank" />
                </q-form>
            </div>
            <q-table title="Informes" :rows="rows" :columns="columns" row-key="name"
                :loading="useBitacora.loading"></q-table>
        </div>
    </div>
</template>

<script setup>
import { Notify } from 'quasar'
import { ref } from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUsersBetweenLines } from '@fortawesome/free-solid-svg-icons';
import { useAprendizStore } from '../stores/aprendices.js';
import { useBitacoraStore } from '../stores/bitacoras.js';
import { useFichaStore } from '../stores/fichas.js';

library.add(faUsersBetweenLines);
let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let useFicha = useFichaStore()
let ficha = ref();
let fecha = ref('');
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
        field: "fecha",
    },
    { name: "estado1", align: "center", label: "Estado", field: "estado" }
]);



async function traer() {
    let res = await useBitacora.getListarBitacoraPorFechaYFicha(fecha.value.trim(), ficha.value.trim());
    if (res.r.data.bitacoras.length === 0) {
        Notify.create({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "No hay registros con esas especificaciones",
            timeout: 2500,
        });
    } else if (res.validar.value === true) {
        let res2 = await useAprendiz.getListarAprendiz();
        let res3 = await useFicha.getListarFichas()
        rows.value = res.r.data.bitacoras.map(bitacora => {
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
        Notify.create({
            color: "green-6",
            message: "Busqueda exitosa",
            icon: "cloud_done",
            timeout: 2500,
        });
    } else {
        Notify.create({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: res.error?.response?.data?.errors?.[0]?.msg || "Error desconocido",
            timeout: 2500,
        });
    }

}

const filterFn = async (val, update) => {
    let res = await useFicha.getListarFichas();
    const fichasActivas = res.data.fichas.filter(ficha => ficha.estado === 1);
    if (val === '') {
        update(() => {
            options.value = fichasActivas.map(ficha => ({
                label: ficha.codigo,
                value: ficha._id
            }));
        });
        return;
    }

    update(() => {
        const needle = val.toLowerCase();
        options.value = fichasActivas.map(ficha => ({
            label: ficha.codigo,
            value: ficha._id
        })).filter(option => option.label.toLowerCase().includes(needle));
    });
}

function onReset() {
    fecha.value = ""
    ficha.value = ""
}

function formatFecha(fecha) {
  const date = new Date(fecha);
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + offset);
  
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("es-ES", options);
}

</script>
<style>
#filtracion {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: center;
    align-content: center;
    align-items: center;
    width: 50%;
}
</style>