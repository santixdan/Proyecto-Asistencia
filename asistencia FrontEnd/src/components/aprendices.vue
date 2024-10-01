<template>
  <div class="todo">
    <h3 id="tituloPrincipal">Aprendices</h3>
    <hr id="hr" class="bg-green-9">
    <div class="q-pa-md">
      <div class="q-pa-md q-gutter-sm">
        <q-btn push label="Crear Aprendiz" color="green-9" @click="(icon = true), (change = false)" />
      </div>
      <q-table title="Aprendices" :rows="rows" :columns="columns" row-key="name" :loading="useAprendiz.loading">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn push @click="(icon = true), (change = true), traerId(props.row._id)"><font-awesome-icon
                  style="font-size: 20px;" icon="pen-to-square" /></q-btn>
              <q-btn push v-if="props.row.estado == 0" @click="activar(props.row._id)"
                :loading="loadingButtons[props.row._id]" color="green-6"><font-awesome-icon style="font-size: 20px;"
                  :icon="['fas', 'check']" /></q-btn>
              <q-btn push v-else @click="desactivar(props.row._id)" :loading="loadingButtons[props.row._id]"
                color="red-6"><font-awesome-icon style="font-size: 20px;" :icon="['fas', 'xmark']" /></q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-estado1="props">
          <q-td :props="props">
            <p style="color: green" v-if="props.row.estado == 1"><strong>Activo</strong></p>
            <p style="color: red" v-else><strong>Inactivo</strong></p>
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="icon" persistent>
        <q-card>
          <q-card-section class="bg-green-9 row items-center">
            <div class="text-h6 text-white" v-if="change == false">Crear Aprendiz</div>
            <div class="text-h6 text-white" v-else>Editar Aprendiz</div>
            <q-space />
            <q-btn class="text-white" icon="close" flat round dense v-close-popup @click="onReset()" />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <q-select filled type="number" v-model="ficha" use-input input-debounce="0" label="Ficha"
                  :options="options" @filter="filterFn" style="max-width: 250px; min-width: 200px;" behavior="menu"
                  emit-value map-options lazy-rules :rules="[
                    val => (val && val.length > 0) ||
                      'Por favor, dígite el código de la ficha'
                  ]">
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
                <q-input style="max-width: 250px; min-width: 200px;" filled v-model="name" label="Nombre" lazy-rules
                  :rules="[
                    val => (val && val.length > 0) ||
                      'Por favor, dígite el nombre del aprendiz'
                  ]">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="user-graduate" />
                  </template>
                </q-input>
                <q-input style="max-width: 250px; min-width: 200px;" filled type="number" v-model="cedula"
                  label="Cédula" lazy-rules :rules="[
                    val => (val && val.length > 0) ||
                      'Por favor, dígite la cédula del aprendiz'
                  ]">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="address-card" />
                  </template>
                </q-input>
                <q-input style="max-width: 250px; min-width: 200px;" filled type="number" v-model="telefono"
                  label="Teléfono" lazy-rules :rules="[
                    val => (val && val.length > 0) ||
                      'Por favor, dígite el teléfono del aprendiz'
                  ]">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="phone" />
                  </template>
                </q-input>
                <q-input style="max-width: 250px; min-width: 200px;" filled v-model="email" label="Correo" lazy-rules
                  :rules="[
                    val => (val && val.length > 0) ||
                      'Por favor, dígite el correo del aprendiz'
                  ]">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="envelope" />
                  </template>
                </q-input>
                <q-file style="max-width: 250px; min-width: 200px;" clearable filled v-model="firma"
                  accept=".jpg, image/*" label="Firma" @input="handleFirma" :rules="[
                    val => val !== null || 'Por favor, seleccione un archivo']">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="file-signature" />
                  </template>
                </q-file>
                <div v-if="firmaPreview && change === true" style="max-width: 250px; min-width: 200px;">
                  <q-img :src="firmaPreview" alt="Firma del aprendiz">
                    <div class="absolute-bottom text-subtitle1 text-center">
                      Firma Actual
                    </div>
                  </q-img>
                </div>
                <div>
                  <q-btn push :loading="useAprendiz.loading" label="Guardar" type="submit" color="green-9" />
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
import { faPenToSquare, faCheck, faXmark, faUsersBetweenLines, faEnvelope, faPhone, faAddressCard, faUserGraduate, faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { Notify } from 'quasar'
import { onBeforeMount, ref } from "vue";
import { useAprendizStore } from '../stores/aprendices.js';
import { useFichaStore } from '../stores/fichas.js';

library.add(faPenToSquare, faCheck, faXmark, faUsersBetweenLines, faEnvelope, faPhone, faAddressCard, faUserGraduate, faFileSignature);
let useFicha = useFichaStore();
let useAprendiz = useAprendizStore()
let email = ref("");
let telefono = ref("");
let ficha = ref();
let cedula = ref("");
let name = ref("");
let firma = ref(null);
let firmaPreview = ref(null);
let icon = ref(false);
let change = ref(); // false: crear, true: modificar
let idAprendiz = ref();
let loadingButtons = ref({});
let options = ref()
let rows = ref([]);
let columns = ref([
  {
    name: "nombre1",
    required: true,
    label: "Nombre del aprendiz",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "cedula1",
    align: "center",
    label: "Cédula",
    field: "cedula",
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
  if (res.data.aprendices.length === 0) {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "No hay registros con esas especificaciones",
      timeout: 2500,
    });
  } else {
    rows.value = res.data.aprendices.map(aprendiz => {
      return {
        ...aprendiz,
        ficha: res2.data.fichas.find(ficha => ficha._id === aprendiz.ficha)?.codigo,
        fichanombre: res2.data.fichas.find(ficha => ficha._id === aprendiz.ficha)?.nombre
      };
    })
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
  let res = await useFicha.getListarFichas();
  let aprendiz = rows.value.find(apprentice => apprentice._id === id);
  let fichaAprendiz = res.data.fichas.find(ficha => ficha.codigo === aprendiz.ficha);
  email.value = aprendiz.email
  telefono.value = aprendiz.telefono
  cedula.value = aprendiz.cedula
  name.value = aprendiz.nombre
  ficha.value = fichaAprendiz._id;
  idAprendiz.value = id;
  firmaPreview.value = aprendiz.firma
}

async function traerFichas() {
  let res = await useFicha.getListarFichas();
  options.value = res.data.fichas.map(ficha => ({
    label: ficha.codigo,
    value: ficha._id
  }));

}

function handleFirma(file) {
  if (file && file.length > 0) {
    const reader = new FileReader();
    console.log(reader);

    reader.onload = (e) => {
      firmaPreview.value = e.target.result; // Asigna la URL de la imagen.
    };
    reader.readAsDataURL(file[0]); // Lee el archivo de imagen.
  }
}

async function crear() {
  let res;
  if (change.value === false) {
    res = await useAprendiz.postCrearAprendiz(ficha.value.trim(), cedula.value.trim(), name.value.trim(), telefono.value.trim(), email.value.trim(), firma.value)
  }
  else {
    res = await useAprendiz.putModificarAprendiz(ficha.value, cedula.value, name.value, telefono.value, email.value, firma.value, idAprendiz.value)
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
      message: res.error?.response?.data?.errors?.[0]?.msg || "Error desconocido",
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
  firma.value = ""
}
</script>
