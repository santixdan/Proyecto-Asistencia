<!-- <template>
    <div>
        <div class="caja">
            <div class="banner">
                <h1 class="titulo">ASISTENCIA</h1>
            </div>
            <img class="logo"
                src="https://play-lh.googleusercontent.com/Z11BUbxZ9AJqe7ZnU3aFLbW3p8hgTnB-Nbt25mb9OsN9q-URzZfzjZNpaLLhQRGf1Fw=w240-h480-rw">
            <q-form @submit="guardar()" @reset="onReset()" class="q-gutter-md">
                <q-input filled v-model="email" label="Correo" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite la correo']"/>
                <q-input :type="isPwd ? 'password' : 'text'" filled v-model="password" label="Contraseña" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite el contraseña']">
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                    </template></q-input>
                <div>
                    <q-btn :loading="useUsuario.loading" type="submit" label="Guardar" color="green-8" />
                </div>
            </q-form>
            <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";
import { useRouter } from 'vue-router'

const router = useRouter()
let useUsuario = useUsuarioStore();
let email = ref("");
let password = ref("");
let isPwd = ref(true);
let mensaje = ref("");

async function guardar() {
    let res = await useUsuario.postLoginUsuario(email.value.trim(), password.value.trim())
    if (res.validar.value == true) {
        mensaje.value = "exito"
        await router.replace('/home');
        email.value = "";
        password.value = "";
    } else {
        mensaje.value = "error"
    }
    // Limpiar los campos de entrada

}
</script>

<style>
.banner {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: green;
    font-size: 30px;
    font-family: Arial, sans-serif;
}

.titulo {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20px;
}

.caja {
    width: 50%;
    height: 50vh;
    background-color: #c1c1c1;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 03);
    justify-content: center;
    align-items: center;
}

.logo {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: grid;
    justify-content: center;
}

.for {
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 49.5%;
    align-items: center;
    margin-left: 25%;
}

.mensaje {
    text-align: center;
    color: green;
    font-weight: bold;
    margin-top: 20px;
}

.error {
    color: red;
}
</style> -->

<template>
    <q-card class="card">
        <q-card-section class="titulo">
            <div>ASISTENCIA</div>
        </q-card-section>
        <q-card-actions class="actions">
            <img class="logo"
                src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586">
            <h2>LOGIN</h2>
            <q-form @submit="guardar()" @reset="onReset()" class="q-gutter-md">
                <q-input filled v-model="email" label="Correo" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite la correo']"
                    @keyup.enter="guardar()" />
                <q-input :type="isPwd ? 'password' : 'text'" filled v-model="password" label="Contraseña"
                    @keyup.enter="guardar()" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite el contraseña']">
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                    </template>
                </q-input>
                <div>
                    <q-btn class="btn" label="Inicar sesión" color="green-8" type="submit" :loading="useUsuario.loading"/>
                </div>
                <!-- <q-tabs class="rutas">
                    <q-route-tab to="/confipass" style="color:green" label="Olvide mi contraseña" />
                </q-tabs> -->
            </q-form>
        </q-card-actions>
        <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
    </q-card>

</template>

<script setup>
import { Notify } from 'quasar'
import { ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";
import { useRouter } from 'vue-router'

const router = useRouter()
let useUsuario = useUsuarioStore();
let email = ref("");
let password = ref("");
let isPwd = ref(true);
let mensaje = ref("");

async function guardar() {
    let res = await useUsuario.postLoginUsuario(email.value.trim(), password.value.trim())
    if (res.validar.value === true) {
        onReset()
        mensaje.value = "exito"
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
    // Limpiar los campos de entrada

}

// function guardar() {
//     // Verificar si ambos campos tienen contenido
//     if (email.value.trim() === "" || password.value.trim() === "") {
//         mensaje.value = "Por favor, complete todos los campos.";
//         return;
//     }

//     // Aquí puedes agregar la lógica para manejar el inicio de sesión
//     // por ejemplo, enviar los datos a un servidor o verificar localmente
//     // ...

//     // Ejemplo de manejo de inicio de sesión
//     if (email.value === "test@example.com" && password.value === "123456") {
//         mensaje.value = "Inicio de sesión exitoso.";
//         // Aquí puedes redirigir al usuario a otra página o realizar otra acción
//     } else {
//         mensaje.value = "Correo o contraseña incorrectos.";
//     }
// }

function onReset() {
    // Restablecer los valores de los campos y el mensaje
    email.value = "";
    password.value = "";
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
    font-size: bold;
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

.forgetcontra {
    margin: 0 auto;
    text-align: center;
    color: green;
    margin-top: 0.8rem;
}

.mensaje {
    text-align: center;
    color: green;
    font-weight: bold;
    margin-top: 20px;
}
</style>
