<template>
    <q-card class="card">
        <div class="logo-container">
            <img class="logo"
                src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586"
                alt="Logo">
        </div>
        <q-card-actions class="actions">
            <q-form @submit="resetPassword()" @reset="onReset()" class="form">
                <q-input :type="isPwd2 ? 'password' : 'text'" filled v-model="newPassword" label="Nueva contraseña"
                    @paste.prevent lazy-rules
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
                    <q-btn class="btn" label="Enviar" type="submit" color="green-9" push />
                </div>
            </q-form>
        </q-card-actions>
    </q-card>
</template>
<script setup>
import { ref } from 'vue';
const newPassword = ref('');
const confirmPassword = ref('');
let isPwd2 = ref(true);
let isPwd3 = ref(true);
import { useUsuarioStore } from "./../stores/usuarios.js";
let useUsuario = useUsuarioStore();
async function resetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    try {
        const res = await useUsuario.putModificarPassword(newPassword, confirmPassword, token)
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
    } catch (error) {
        console.error('Error:', error);
    }
};
</script>