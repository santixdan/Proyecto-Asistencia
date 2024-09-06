<template>
    <div class="q-pa-md row items-start q-gutter-md col-10 col-xs-10 col-sm-8 col-md-4 col-lg-4 items-center flex q-my-lg"
        align="center" id="superContainer">
        <q-card class="my-card">
            <q-card-section class="bg-green-9 text-white">
                <h4 data-v-8ea77ebc class="q-mt-sm q-mb-sm text-white text-center text-weight-bold">ASISTENCIA</h4>
            </q-card-section>

            <q-card-actions class="cardContent" align="center">
                <div data-v-8ea77ebc class="column items-center q-mt-md">
                    <img style="height: 100px; width: 100px;"
                        src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586">
                </div>
                <div data-v-8ea77ebc class="text-h5 text-weight-bold" id="logintxt">LOG IN</div>
                <hr data-v-8ea77ebc class="q-separator q-separator--horizontal" aria-orientation="horizontal" id="hr2">
                <q-form @submit="guardar()" @reset="onReset()" class="q-gutter-md">
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
                        <q-btn class="btn" label="Iniciar sesión" color="green-9" type="submit"
                            :loading="useUsuario.loading" />
                    </div>
                </q-form>
            </q-card-actions>
        </q-card>
    </div>


</template>

<script setup>
import { Loading, Notify } from 'quasar'
import { ref } from "vue";
import { useUsuarioStore } from "./../stores/usuarios.js";
import { useRouter } from 'vue-router'

const router = useRouter()
let useUsuario = useUsuarioStore();
let email = ref("");
let password = ref("");
let isPwd = ref(true);

async function guardar() {
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
}
</script>

<style scoped>
.my-card {
    width: 100%;
    max-width: 400px;
}

#hr2 {
    width: 100%;
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