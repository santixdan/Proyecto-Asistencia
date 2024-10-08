<template>
  <div class="todo">
    <h3 id="tituloPrincipal">Usuarios</h3>
    <hr id="hr" class="bg-green-9">
    <div class="q-pa-md">
      <div class="q-pa-md q-gutter-sm">
        <q-btn push label="Crear Usuario" color="green-9" @click="(icon = true), (change = false)" />
      </div>
      <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="name" :loading="useUsuario.loading">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn @click="(icon = true), (change = true), traerId(props.row._id)" push><font-awesome-icon
                  style="font-size: 20px;" icon="pen-to-square" /></q-btn>
              <q-btn v-if="props.row.estado == 0" @click="activar(props.row._id)"
                :loading="loadingButtons[props.row._id]" push color="green-6"><font-awesome-icon
                  style="font-size: 20px;" :icon="['fas', 'check']" /></q-btn>
              <q-btn v-else @click="desactivar(props.row._id)" :loading="loadingButtons[props.row._id]" push
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
            <div class="text-h6 text-white" v-if="change == false">Crear Usuario</div>
            <div class="text-h6 text-white" v-else>Editar Usuario</div>
            <q-space />
            <q-btn class="text-white" icon="close" flat round dense v-close-popup @click="onReset()" />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md" style="max-width: 400px">
              <q-form @submit="crear()" @reset="onReset()" class="q-gutter-md">
                <q-input  style="max-width: 250px; min-width: 200px;" filled v-model="email" label="Correo" lazy-rules :rules="[
                  val => (val && val.length > 0) ||
                    'Por favor, dígite el correo del usuario'
                ]">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="envelope" />
                  </template>
                </q-input>
                <q-input  style="max-width: 250px; min-width: 200px;" filled v-model="name" label="Nombre" lazy-rules :rules="[
                  val => (val && val.length > 0) ||
                    'Por favor, dígite el nombre del usuario'
                ]">
                  <template v-slot:prepend>
                    <font-awesome-icon icon="user" />
                  </template>
                </q-input>
                <q-input  style="max-width: 250px; min-width: 200px;" @paste.prevent v-if="change === false" :type="isPwd ? 'password' : 'text'" filled
                  v-model="password" label="Contraseña" lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Por favor, dígite la contraseña']"><template
                    v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template><template v-slot:prepend>
                    <font-awesome-icon icon="lock" />
                  </template></q-input>
                <div>
                  <q-btn push :loading="useUsuario.loading" label="Guardar" type="submit" color="green-9" />
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
import { faPenToSquare, faCheck, faXmark, faEnvelope, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Notify } from 'quasar'
import { onBeforeMount, ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";

library.add(faPenToSquare, faCheck, faXmark, faEnvelope, faUser, faLock);
let useUsuario = useUsuarioStore();
let email = ref("");
let name = ref("");
let password = ref("");
let icon = ref(false);
let isPwd = ref(true);
let change = ref(); // false: crear, true: modificar
let idUsuario = ref();
let loadingButtons = ref({});
let rows = ref([]);
let columns = ref([
  {
    name: "nombre1",
    required: true,
    label: "Nombre del usuario",
    align: "center",
    field: "nombre",
    sortable: true,
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
})

async function traer() {
  let res = await useUsuario.getListarUsuarios();
  if (res.data.usuarios.length === 0) {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "No hay registros con esas especificaciones",
      timeout: 2500,
    });
  } else {
    rows.value = res.data.usuarios;
  }
}

async function activar(id) {
  loadingButtons.value[id] = true;
  let res = await useUsuario.putActivarUsuario(id);
  if (useUsuario.loading == false) {
    loadingButtons.value[id] = false;
  }
  traer();
}

async function desactivar(id) {
  loadingButtons.value[id] = true;
  let res = await useUsuario.putDesactivarUsuario(id);
  if (useUsuario.loading == false) {
    loadingButtons.value[id] = false;
  }
  traer();
}

async function traerId(id) {
  let usuario = rows.value.find(user => user._id === id);
  email.value = usuario.email;
  name.value = usuario.nombre;
  idUsuario.value = id;
}

async function crear() {
  let res;
  if (change.value === false) {
    res = await useUsuario.postCrearUsuario(email.value.trim(), name.value.trim(), password.value.trim());
  }
  else {
    res = await useUsuario.putModificarUsuario(email.value.trim(), name.value.trim(), idUsuario.value);
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
  name.value = "";
  email.value = "";
  password.value = "";
}
</script>