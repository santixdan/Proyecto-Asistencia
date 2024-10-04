<template>
    <div class="q-pa-md row items-start q-gutter-md col-10 col-xs-10 col-sm-8 col-md-4 col-lg-4 items-center flex q-my-lg"
        align="center" id="superContainer" style="margin: 0px;">
        <q-card style="margin: 0px;" class="my-card">
            <q-card-section class="bg-green-9 text-white">
                <h4 data-v-8ea77ebc class="q-mt-sm q-mb-sm text-white text-center text-weight-bold">ASISTENCIA
                </h4>
            </q-card-section>

            <q-card-actions class="cardContent" align="center">
                <div data-v-8ea77ebc class="column items-center q-mt-md">
                    <img style="height: 100px; width: 100px;"
                        src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586">
                </div>
                <div data-v-8ea77ebc class="text-h5 text-weight-bold" id="logintxt">LOG IN</div>
                <hr data-v-8ea77ebc class="q-separator q-separator--horizontal" aria-orientation="horizontal" id="hr2">
                <div>
                    <q-select filled v-model="model" :options="options" label="Rol" style="width: 250px;"
                        behavior="menu" emit-value map-options @update:model-value="onReset()"><template v-slot:prepend>
                            <font-awesome-icon icon="users" />
                        </template></q-select>
                </div><br>
                <div class="q-pa-md" style="max-width: 300px">
                    <q-form v-if="model === 'USUARIO'" @submit="login()" class="q-gutter-md">
                        <q-input style="width: 250px;" filled v-model="email" label="Correo" lazy-rules
                            :rules="[val => (val && val.length > 0) || 'Por favor, dígite el correo']">
                            <template v-slot:prepend>
                                <font-awesome-icon icon="envelope" />
                            </template>
                        </q-input>
                        <q-input style="width: 250px" :type="isPwd1 ? 'password' : 'text'" filled v-model="password"
                            label="Contraseña" lazy-rules @paste.prevent
                            :rules="[val => (val && val.length > 0) || 'Por favor, dígite la contraseña']">
                            <template v-slot:append>
                                <q-icon :name="isPwd1 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd1 = !isPwd1" />
                            </template>
                            <template v-slot:prepend>
                                <font-awesome-icon icon="lock" />
                            </template>
                        </q-input>
                        <q-btn push class="btn" label="Iniciar sesión" color="green-9" type="submit"
                            :loading="useUsuario.loading" />
                        <div>
                            <q-btn push label="Olvidé mi contraseña" color="green-9" flat class="q-ml-sm"
                                @click="(icon = true)" />
                        </div>
                    </q-form>
                    <q-form v-else @submit="crear()" class="q-gutter-md">

                        <q-input style="width: 250px" filled type="number" v-model="cedula" label="Cédula" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Por favor, dígite la cédula del aprendiz']">
                            <template v-slot:prepend>
                                <font-awesome-icon icon="address-card" />
                            </template>
                        </q-input>
                        <div>
                            <q-btn push :loading="useBitacora.loading" class="btn" label="Registrar" color="green-9"
                                type="submit" />
                        </div>
                    </q-form>
                </div>
            </q-card-actions>
        </q-card>
        <div v-show="icon === true" class="q-pa-md q-gutter-sm">
            <q-dialog v-show="icon === true" v-model="icon" persistent>
                <q-card>
                    <q-card-section class="bg-green-9 row items-center">
                        <div class="text-h6 text-white">Cambiar contraseña</div>
                        <q-space />
                        <q-btn class="text-white" push icon="close" flat round dense v-close-popup @click="onReset()" />
                    </q-card-section>

                    <q-card-section>
                        <div class="q-pa-md" style="max-width: 400px">
                            <q-form @submit="recuperar()" class="q-gutter-md">
                                <q-input style="max-width: 250px; min-width: 200px;" filled v-model="email2"
                                    label="Correo" lazy-rules
                                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite el correo']">
                                    <template v-slot:prepend>
                                        <font-awesome-icon icon="envelope" />
                                    </template>
                                </q-input>
                                <div>
                                    <q-btn push :loading="useUsuario.loading" label="Enviar" type="submit"
                                        color="green-9" />
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAddressCard, faEnvelope, faLock, faUsers, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
// import { faCalendarDay } from '@fortawesome/free-regular-svg-icons';  // Regular icons
import { ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";
import { useRouter } from 'vue-router'
import { useBitacoraStore } from '../stores/bitacoras.js';
import moment from 'moment-timezone';


library.add(faAddressCard, faCalendarDay, faEnvelope, faLock, faUsers);
const router = useRouter()
let useBitacora = useBitacoraStore()
let useUsuario = useUsuarioStore();
let email = ref("");
let email2 = ref("");
let password = ref("");
let isPwd1 = ref(true);
let icon = ref(false);
const fecha = moment.tz('America/Bogota').startOf('day').toDate();
let cedula = ref("");
let model = ref("APRENDIZ")
let options = ['APRENDIZ', 'USUARIO']

async function recuperar() {
    let res = await useUsuario.postEnviarEmail(email2.value.trim())
    if (res.validar.value === true) {
        icon.value = false
        onReset()
        Notify.create({
            color: "green-6",
            message: "Email Enviado",
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

async function login() {
    let res = await useUsuario.postLoginUsuario(email.value.trim(), password.value.trim());
    if (res.validar.value === true) {
        await router.replace('/home');
        onReset();
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

async function crear() {
    let res = await useBitacora.postCrearBitacora2(cedula.value.trim(), fecha)
    
    if (res.validar.value === true) {
        onReset()
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
    email.value = "";
    password.value = "";
    email2.value = "";
    fecha.value = "";
    cedula.value = "";
}
</script>
<style scoped>
.my-card {
    width: 100%;
    max-width: 450px;
}

#hr2 {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
}

#superContainer {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    height: 100vh !important;
}

#logintxt {
    margin-top: 15px;
}

.cardContent {
    display: flex;
    flex-direction: column;
}
</style>