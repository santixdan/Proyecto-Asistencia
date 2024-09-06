<template>
    <div class="q-pa-md row items-start q-gutter-md col-10 col-xs-10 col-sm-8 col-md-4 col-lg-4 items-center flex q-my-lg"
        align="center" id="superContainer">
        <q-card class="my-card">
            <q-card-section class="bg-green-9 text-white">
                <h4 data-v-8ea77ebc class="q-mt-sm q-mb-sm text-white text-center text-weight-bold">ASISTENCIA</h4>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
            </q-card-section>

            <q-card-actions class="cardContent" align="center">
                <div data-v-8ea77ebc class="column items-center q-mt-md">
                    <img style="height: 100px; width: 100px;"
                        src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586">
                </div>
                <div data-v-8ea77ebc class="text-h5 text-weight-bold" id="logintxt">LOG IN</div>
                <hr data-v-8ea77ebc class="q-separator q-separator--horizontal" aria-orientation="horizontal" id="hr2">
                <div class="q-pa-md" style="max-width: 300px">
                    <div class="q-gutter-md">
                        <q-select filled v-model="model" :options="options" label="Rol" style="width: 230px"
                            behavior="menu" emit-value map-options />
                    </div>
                </div> <br>
                <q-form v-show="model == 'APRENDIZ'" @submit="crear()" @reset="onReset()" class="q-gutter-md">
                    <q-input filled type="number" v-model="aprendiz" label="Aprendiz" lazy-rules
                        :rules="[val => val && val.length > 0 || 'Por favor, dígite la cédula del aprendiz']" />
                    <q-input filled v-model="fecha" label="Fecha" mask="date" lazy-rules
                        :rules="[val => val && val.length > 0 || 'Por favor, dígite la fecha de la bitácora']">
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
                    <div>
                        <q-btn label="Registrar" type="submit" color="green-9" />
                    </div>
                </q-form>
                <q-form v-show="model == 'USUARIO'" @submit="login()" @reset="onReset()" class="q-gutter-md">
                    <q-input filled v-model="email" label="Correo" lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Por favor, dígite la correo']" />
                    <q-input :type="isPwd ? 'password' : 'text'" filled v-model="password" label="Contraseña" lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Por favor, dígite el contraseña']">
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                    <div>
                        <q-btn class="btn" label="Inicar sesión" color="green-9" type="submit"
                            :loading="useUsuario.loading" />
                    </div>
                </q-form>
            </q-card-actions>
        </q-card>
    </div>


</template>

<script setup>
import { Notify } from 'quasar'
import { onBeforeMount, ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";
import { useRouter } from 'vue-router'
import { useBitacoraStore } from '../stores/bitacoras.js';

const router = useRouter()
let useBitacora = useBitacoraStore()
let useUsuario = useUsuarioStore();
let email = ref("");
let fecha = ref();
let password = ref("");
let isPwd = ref(true);
let aprendiz = ref();
let model = ref("APRENDIZ"); // true: aprendiz, false: usuario
let options = ['APRENDIZ', 'USUARIO']


async function crear() {
    let res = await useBitacora.postCrearBitacora(aprendiz.value.trim(), fecha.value.trim())
    if (res.validar.value === true) {
        onReset()
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

async function login() {
    let res = await useUsuario.postLoginUsuario(email.value.trim(), password.value.trim())

    if (res.validar.value === true) {
        onReset()
        await router.replace('/home');
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
    email.value = "";
    password.value = "";
}
</script>

<style scoped>
.my-card {
    width: 100%;
    max-width: 400px;
}

#hr2 {
    width: 100%;
    /* height: 1px !important; */
    /* border: 0px; */
    margin-top: 10px;
    margin-bottom: 10px;
}

#superContainer {
    justify-content: center;
    align-content: center;

}

#logintxt {
    margin-top: 15px;
}

.cardContent {
    display: flex;
    flex-direction: column;
}
</style>