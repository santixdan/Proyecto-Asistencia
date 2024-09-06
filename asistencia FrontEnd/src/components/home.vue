<template>
  <q-layout view="hHh lpR lff">
    <q-header elevated class="bg-green-9 text-with">
      <q-toolbar class="custom-toolbar-title" >
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://lostramites.com.co/wp-content/uploads/logo-de-Sena-sin-fondo-Blanco-300x300.png" />
          </q-avatar>
          <q-btn v-if="$route.path != '/home'" to="/home" id="btnBack"><font-awesome-icon
              :icon="['fas', 'arrow-right-from-bracket']" style="font-size: 24px;" /></q-btn>
          <q-btn v-else to="/" id="btnBack"><font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']"
              style="font-size: 24px;" /></q-btn>
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
            <q-btn to="/ficha" label="Fichas" color="green-9" class="full-width q-mb-sm" />
            <q-btn to="/bitacora" label="Bitacoras" color="green-9" class="full-width q-mb-sm" />
            <q-btn to="/aprendiz" label="Aprendices" color="green-9" class="full-width q-mb-sm" />
            <q-btn to="/usuario" label="Usuarios" color="green-9" class="full-width q-mb-sm" />
          </div>
        </q-list>
      </q-scroll-area>

      <q-img align="center" class="absolute-top" src="https://img.freepik.com/vector-premium/fondo-diferentes-formas-verdes_23-2148358648.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ !nombre?"":nombre }}</div>
          <div>{{ !correo?"":correo }}</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <div v-if="$route.path === '/home'" class="q-pa-md row items-start q-gutter-md" id="divCards">
        <q-card class="my-card text-white" >
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">FICHAS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/qZ5fc/MAEer0qZ5fc/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/ficha" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white" id="cards">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">BITÁCORAS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/30S9k/MAENv230S9k/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/bitacora" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white" id="cards">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">APRENDICES</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/E15p4/MAE1sdE15p4/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/aprendiz" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card text-white" id="cards">
          <q-card-section class="bg-green-9">
            <div class="text-h6" align="center">USUARIOS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/ZD6iE/MAEpzcZD6iE/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/usuario" color="green-9">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <router-view></router-view>
    </q-page-container>
    <q-footer class="bg-grey-4 text-black">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center text-h6 text-weight-bold text-subtitle1">REPFORA - Sena 2024 © Todos los derechos reservados</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useUsuarioStore } from "./../stores/usuarios.js";

let useUsuario = useUsuarioStore();
let correo = ref(useUsuario.usuario.email) 
let nombre = ref(useUsuario.usuario.nombre)

library.add(faArrowRightFromBracket);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
/* .custom-toolbar-title {
  background-color: #2E7D32;
} */

#cards {
  background-color: white !important;
}

#divCards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  margin: 0 auto;
}

#imgCards {
  height: 100px;
}

#imgSection,
#btnSection {
  display: flex;
  justify-content: center;
}

#btnBack {
  float: right;
  margin: none;
  /* width: 5%; */
}

#imgBtnBack {
  width: 20px;
}

.my-card {
  width: 100%;
  max-width: 250px
}

#hr {
  width: 90%;
  height: 5px !important;
  /* background-color: #2E7D32; */
  border: 0px;
}

#tituloPrincipal {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

@media screen and (max-width:550px) and (min-width:300px){
  #divCards{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
}
</style>