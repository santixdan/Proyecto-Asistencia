<template>
    <div class="todo">
        <h3 id="tituloPrincipal">Informes</h3>
        <hr id="hr" class="bg-green-9">
        <div class="q-pa-md">
            <div class="q-pa-md q-gutter-sm">
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
                <q-btn push label="Buscar" color="green-9" @click="traer()"/>
                <q-btn push style="float: right;" round color="green-9" icon="print" to="/tabla" target="_blank" />
            </div>
            <q-table title="Informes" :rows="rows" :columns="columns" row-key="name" :loading="useBitacora.loading">
                <!-- <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div class="q-pa-md" align="center">
                            <q-select filled v-model="props.row.estado" label="Estado" style="max-width: 300px;"
                                :options="optionsEstado" emit-value map-options :loading="loadingButtons[props.row._id]"
                                @update:model-value="updateEstado($event, props.row._id)" />
                        </div>
                    </q-td>
                </template> -->
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

let useBitacora = useBitacoraStore()
let useAprendiz = useAprendizStore()
let useFicha = useFichaStore()
let ficha = ref();
let fecha = ref();
let options = ref()
// let loadingButtons = ref({});
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
    { name: "estado1", align: "center", label: "Estado", field: "estado" }
]);

// onBeforeMount(() => {
//     traer()
//     // traerAprendices()
// })


async function traer() {
    let res = await useBitacora.getListarBitacoraPorFechaYFicha(fecha.value.trim(), ficha.value.trim());
    console.log(res);
    let res2 = await useAprendiz.getListarAprendiz();
    rows.value = res.data.bitacoras.map(bitacora => {
        return {
            ...bitacora,
            aprendiz: res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz)?.cedula,
            aprendiznombre: res2.data.aprendices.find(aprendiz => aprendiz._id === bitacora.aprendiz)?.nombre
        };
    })
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
    aprendiz.value = ""
}

</script>