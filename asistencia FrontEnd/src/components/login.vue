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
                <div class="q-pa-md" style="max-width: 300px">
                    <div class="q-gutter-md">
                        <q-select filled v-model="model" :options="options" label="Rol" style="width: 230px"
                            behavior="menu" emit-value map-options />
                    </div>
                </div><br>
                <q-form v-if="model === 'USUARIO'" @submit="login()" class="q-gutter-md">
                    <q-input filled v-model="email" label="Correo" lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Por favor, dígite el correo']" />
                    <q-input :type="isPwd1 ? 'password' : 'text'" filled v-model="password" label="Contraseña"
                        lazy-rules :rules="[val => (val && val.length > 0) || 'Por favor, dígite la contraseña']">
                        <template v-slot:append>
                            <q-icon :name="isPwd1 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd1 = !isPwd1" />
                        </template>
                    </q-input>
                    <q-btn push label="Olvidé mi contraseña" color="green-9" flat class="q-ml-sm"
                        @click="(icon = true)" />
                    <div>
                        <q-btn push class="btn" label="Iniciar sesión" color="green-9" type="submit"
                            :loading="useUsuario.loading" />
                    </div>
                </q-form>
                <q-form v-if="model === 'USUARIO'" @submit="login()" class="q-gutter-md"></q-form>
            </q-card-actions>
        </q-card>
        <div v-show="icon === true" class="q-pa-md q-gutter-sm">
            <q-dialog v-show="icon === true" v-model="icon" persistent>
                <q-card>
                    <q-card-section class="row items-center q-pb-none">
                        <div class="text-h6">Cambiar contraseña</div>
                        <q-space />
                        <q-btn push icon="close" flat round dense v-close-popup @click="onReset()" />
                    </q-card-section>

                    <q-card-section>
                        <div class="q-pa-md" style="max-width: 400px">
                            <q-form @submit="recuperar()" class="q-gutter-md">
                                <q-input filled v-model="email2" label="Correo" lazy-rules
                                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite el correo']" />
                                <q-input :type="isPwd2 ? 'password' : 'text'" filled v-model="newPassword"
                                    label="Nueva contraseña" lazy-rules
                                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite la nueva contraseña']"><template
                                        v-slot:append>
                                        <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                            @click="isPwd2 = !isPwd2" />
                                    </template></q-input>
                                <q-input :type="isPwd3 ? 'password' : 'text'" filled v-model="confirmPassword"
                                    label="Confirmar contraseña" @paste.prevent lazy-rules
                                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite la confirmación de la contraseña']"><template
                                        v-slot:append>
                                        <q-icon :name="isPwd3 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                            @click="isPwd3 = !isPwd3" />
                                    </template></q-input>
                                <div>
                                    <q-btn push label="Guardar" type="submit" color="green-9" />
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
import { ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";
import { useRouter } from 'vue-router'

const router = useRouter()
let useUsuario = useUsuarioStore();
let email = ref("");
let email2 = ref("");
let password = ref("");
let isPwd1 = ref(true);
let isPwd2 = ref(true);
let isPwd3 = ref(true);
let icon = ref(false);
let model = ref("APRENDIZ")
let options = ['APRENDIZ', 'USUARIO']
let newPassword = ref()
let confirmPassword = ref()

async function recuperar() {
    // let res1 = await useUsuario.getListarUsuarios();
    // let usuario = res1.data.usuarios.find(usuario => email2.value === usuario.email);
    // let id = ref(usuario._id);
    if (newPassword.value !== confirmPassword.value) {
        Notify.create({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "Las contraseñas no coinciden",
            timeout: 2500,
        });
    } else {
        let res = await useUsuario.putModificarPassword(email2.value.trim(), newPassword.value.trim(), confirmPassword.value.trim())
        if (res.validar.value === true) {
            icon.value = false
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
                message: res.error.response.data.errors[0].msg,
                timeout: 2500,
            });
        }
    }

}

async function login() {
    let res = await useUsuario.postLoginUsuario(email.value.trim(), password.value.trim())

    if (res.validar.value === true) {
        await router.replace('/home');
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
            message: res.error.response.data.errors[0].msg,
            timeout: 2500,
        });
    }
}

function onReset() {
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    newPassword.value = "";
    email2.value = "";
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
<!-- <template>
    <q-card class="card">
        <q-card-section class="titulo">
            <div>ASISTENCIA</div>
        </q-card-section>
        <q-card-actions class="actions">
            <img class="logo"
                src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586" />
            <h2>APRENDIZ</h2>
            <q-form @submit="guardar" @reset="onReset" class="q-gutter-md">
                <q-input filled v-model="document" label="Documento" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite su documento']"
                    @keyup.enter="guardar" />
                <div>
                    <q-btn push class="btn" label="Registrarse" color="green" type="submit" />
                </div>
            </q-form>
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { ref } from "vue";

// Definir documentos válidos para pruebas
const documentosValidos = ["123456789",];

let document = ref("");
let mensaje = ref("");

function login() {
    // Verificar si el campo del documento tiene contenido
    if (document.value.trim() === "") {
        mensaje.value = "Por favor, complete todos los campos.";
        return;
    }

    // Validar si el documento está en la lista de documentos válidos
    if (documentosValidos.includes(document.value.trim())) {
        mensaje.value = "Registro exitoso.";
    } else {
        mensaje.value = "Documento no válido.";
    }
}

function onReset() {
    // Restablecer los valores de los campos y el mensaje
    document.value = "";
    mensaje.value = "";
}
</script>

<style scoped>
.card {
    top: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 30%;
    margin: 0 auto;
}

.titulo {
    font-size: 2.8rem;
    text-align: center;
    padding: 1.5rem;
    font-weight: bold;
    color: rgb(255, 255, 255);
    background-color: green;
}

.logo {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: grid;
    justify-content: center;
}

h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    width: 100%;
}

.actions {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.btn {
    margin: 0 auto;
    align-items: center;
    display: flex;
}

.mensaje {
    text-align: center;
    color: green;
    font-weight: bold;
    margin-top: 20px;
}
</style> -->