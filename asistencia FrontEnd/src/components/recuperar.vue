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
                <div data-v-8ea77ebc class="text-h5 text-weight-bold" id="logintxt">RECUPERAR CONTRASEÑA</div>
                <hr data-v-8ea77ebc class="q-separator q-separator--horizontal" aria-orientation="horizontal" id="hr2">
                <br>
                <q-form @submit="resetPassword()" class="q-gutter-md">
                    <q-input :type="isPwd2 ? 'password' : 'text'" filled v-model="newPassword" label="Nueva contraseña"
                        @paste.prevent lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Por favor, dígite la nueva contraseña']"><template
                            v-slot:append>
                            <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd2 = !isPwd2" />
                        </template>
                        <template v-slot:prepend>
                            <font-awesome-icon icon="lock" />
                        </template>
                    </q-input>
                    <q-input :type="isPwd3 ? 'password' : 'text'" filled v-model="confirmPassword"
                        label="Confirmar contraseña" @paste.prevent lazy-rules
                        :rules="[val => (val && val.length > 0) || 'Por favor, dígite la confirmación de la contraseña']"><template
                            v-slot:append>
                            <q-icon :name="isPwd3 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd3 = !isPwd3" />
                        </template>
                        <template v-slot:prepend>
                            <font-awesome-icon icon="lock" />
                        </template>
                    </q-input>
                    <div>
                        <q-btn push :loading="useUsuario.loading" label="Guardar" type="submit" color="green-9" />
                    </div>
                </q-form>
            </q-card-actions>
        </q-card>
    </div>
</template>
<script setup>
import { Notify } from 'quasar'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from "./../stores/usuarios.js";

library.add(faLock);
const router = useRouter();
const useUsuario = useUsuarioStore();
let newPassword = ref('');
let confirmPassword = ref('');
let isPwd2 = ref(true);
let isPwd3 = ref(true);
let token = router.currentRoute.value.params.token;

async function resetPassword() {
    try {
        if (newPassword.value != confirmPassword.value) {
            Notify.create({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: "Las contraseñas no coinciden",
                timeout: 2500,
            });
        } else {
            const res = await useUsuario.putModificarPassword(newPassword.value.trim(), confirmPassword.value.trim(), token)
            if (res.validar.value === true) {
                onReset()
                await router.push('/');
                Notify.create({
                    color: "green-6",
                    message: "Cambio exitoso",
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
    } catch (error) {
        console.error(error);
    }
};

function onReset() {
    newPassword.value = "";
    confirmPassword.value = "";
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
    margin-left: 0px;
    margin-right: 0px;
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