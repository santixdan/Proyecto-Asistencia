<template>
    <div class="q-pa-md" style="max-width: 400px">

        <q-form @reset="onReset()" class="q-gutter-md">
            <q-input filled v-model="email" label="Email" hint="email del usuario" lazy-rules
                :rules="[val => val && val.length > 0 || 'Por favor, dígite el correo del usuario']" />

            <q-input v-model="password" filled label="Contraseña" :type="isPwd ? 'password' : 'text'" hint="Contraseña" lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor, dígite la contraseña']">
                <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                </template>
            </q-input>

            <div>
                <q-btn label="Submit" type="submit" color="primary" @click="login"/>
            </div>
        </q-form>

    </div>
</template>

<script setup>
import { Notify } from 'quasar'
import { ref } from 'vue'
import { useUsuarioStore } from '../stores/usuarios';
import { useRouter } from 'vue-router'

const router = useRouter()
const useUsuario = useUsuarioStore()
const email = ref('')
const password = ref('')
const isPwd = ref(true)

async function login() {
    let res = await useUsuario.postLoginUsuario(email.value, password.value);
    if (res.validar.value === true) {
        router.push('/home');
        onReset()
        Notify.create({
            color: "green-3",
            message: "Inicio de sesión exitoso",
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
    email.value = ""
    password.value = ""
}
</script>