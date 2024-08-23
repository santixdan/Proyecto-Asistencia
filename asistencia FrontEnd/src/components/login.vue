<template>
    <div>
        <div class="caja">
            <div class="banner">
                <h1 class="titulo">ASISTENCIA</h1>
            </div>
            <img class="logo"
                src="https://play-lh.googleusercontent.com/Z11BUbxZ9AJqe7ZnU3aFLbW3p8hgTnB-Nbt25mb9OsN9q-URzZfzjZNpaLLhQRGf1Fw=w240-h480-rw">
            <!-- <form class="for" @submit.prevent="guardar" style="text-align: center">
        <label for="correo">Correo</label>
        <input type="text" v-model="correo" /><br>
        <span v-if="errorCorreo" class="correo">{{ errorCorreo }}</span>

        <label for="contraseña">Contraseña</label>
        <input type="password" v-model="contra"/><br>
        <span v-if="errorContra" class="error">{{ errorContra }}</span>

        <button type="submit">Agregar</button><br />
      </form> -->
            <q-form @reset="onReset()" class="q-gutter-md">
                <q-input filled v-model="email" label="Correo" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite la correo']" @keyup.enter="guardar()"/>
                <q-input :type="isPwd ? 'password' : 'text'" filled v-model="password" label="Contraseña" @keyup.enter="guardar()" lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Por favor, dígite el contraseña']">
                    <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="isPwd = !isPwd" />
                    </template></q-input>
                <div>
                    <q-btn :loading="useUsuario.loading" label="Guardar" color="green-8" @click="guardar()" />
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
</style>
