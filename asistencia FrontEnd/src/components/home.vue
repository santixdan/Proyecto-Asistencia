<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-green-9 text-with">
      <q-toolbar class="custom-toolbar-title">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <router-link to="/home">
            <q-avatar class="cursor-pointer">
              <img src="https://lostramites.com.co/wp-content/uploads/logo-de-Sena-sin-fondo-Blanco-300x300.png" />
            </q-avatar>
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="
              height: calc(100% - 150px);
              margin-top: 150px;
              border-right: 1px solid #ddd;
            ">
        <q-list padding>
          <div class="q-pa-md q-gutter-sm column">
            <q-btn push to="/ficha" label="Fichas" color="green-9" class="full-width q-mb-sm" />
            <q-btn push to="/bitacora" label="Bitacoras" color="green-9" class="full-width q-mb-sm" />
            <q-btn push to="/aprendiz" label="Aprendices" color="green-9" class="full-width q-mb-sm" />
            <q-btn push to="/usuario" label="Usuarios" color="green-9" class="full-width q-mb-sm" />
            <q-btn push to="/informe" label="Informe" color="green-9" class="full-width q-mb-sm" />
            <q-btn push flat label="Cerrar sesión" color="green-9" class="full-width q-mb-sm" @click="alert = true" />
          </div>
        </q-list>
      </q-scroll-area>

      <q-img align="center" class="absolute-top"
        src="https://img.freepik.com/vector-premium/fondo-diferentes-formas-verdes_23-2148358648.jpg"
        style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://lostramites.com.co/wp-content/uploads/logo-de-Sena-sin-fondo-Blanco-300x300.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ nombre }}</div>
          <div>{{ correo }}</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <div v-if="$route.path === '/home'" class="q-pa-md row justify-center items-center q-gutter-md">
        <q-card class="my-card text-white">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">FICHAS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/qZ5fc/MAEer0qZ5fc/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn push to="/ficha" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">BITÁCORAS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/30S9k/MAENv230S9k/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn push to="/bitacora" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">APRENDICES</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/E15p4/MAE1sdE15p4/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn push to="/aprendiz" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">USUARIOS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/ZD6iE/MAEpzcZD6iE/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn push to="/usuario" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">INFORMES</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/NKnUU/MAFiIINKnUU/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn push to="/informe" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <router-view></router-view>
    </q-page-container>
    <q-footer class="bg-grey-4 text-black">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center text-h6 text-weight-bold text-subtitle1">REPFORA - Sena 2024 © Todos los derechos
            reservados</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="alert" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Cerrar sesión</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            ¿Seguro que deseas cerrar sesión?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Sí" to="/" color="red-9" v-close-popup @click="useUsuario.logout()" />
            <q-btn flat label="No" color="green-9" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuarioStore } from "./../stores/usuarios.js";

let useUsuario = useUsuarioStore();
let correo = ref(useUsuario?.usuario?.email || "none")
let nombre = ref(useUsuario?.usuario?.nombre || "none")
let alert = ref(false)


const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
#imgCards {
  height: 150px;
}

#imgSection,
#btnSection {
  display: flex;
  justify-content: center;
}

.my-card {
  width: 100%;
  max-width: 400px
}

#hr {
  width: 90%;
  height: 5px !important;
  border: 0px;
}

#tituloPrincipal {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 10px;
}
</style>
