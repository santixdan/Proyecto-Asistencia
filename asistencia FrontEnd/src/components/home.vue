<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-with">
      <q-toolbar class="custom-toolbar-title">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img
              src="https://lostramites.com.co/wp-content/uploads/logo-de-Sena-sin-fondo-Blanco-300x300.png" />
          </q-avatar>
          <!--  @click="$router.go(-1)"  -->
          <q-btn v-if="$route.path != '/home'" to="/home" id="btnBack"><font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" style="font-size: 24px;" /></q-btn>
          <q-btn v-else to="/" id="btnBack"><font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" style="font-size: 24px;" /></q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <div class="q-pa-md q-gutter-sm column">
        <q-btn to="/ficha" label="Fichas" color="green" class="full-width q-mb-sm" />
        <q-btn to="/bitacora" label="Bitacoras" color="green" class="full-width q-mb-sm" />
        <q-btn to="/aprendiz" label="Aprendices" color="green" class="full-width q-mb-sm" />
        <q-btn to="/usuario" label="Usuarios" color="green" class="full-width q-mb-sm" />
      </div>
    </q-drawer>
    <q-page-container>
      <div v-if="$route.path === '/home'" class="q-pa-md row items-start q-gutter-md" id="divCards">
        <q-card class="my-card bg-secondary text-white" id="cards">
          <q-card-section style="background-color: #4CAF50 !important">
            <div class="text-h6" align="center">FICHAS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/qZ5fc/MAEer0qZ5fc/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/ficha" flat style="background-color: #4CAF50 !important">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card bg-secondary text-white" id="cards">
          <q-card-section style="background-color: #4CAF50 !important">
            <div class="text-h6" align="center">BITÁCORAS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/30S9k/MAENv230S9k/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/bitacora" style="background-color: #4CAF50 !important">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card bg-secondary text-white" id="cards">
          <q-card-section style="background-color: #4CAF50 !important">
            <div class="text-h6" align="center">APRENDICES</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/E15p4/MAE1sdE15p4/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/aprendiz" style="background-color: #4CAF50 !important">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
        <q-card class="my-card bg-secondary text-white" id="cards">
          <q-card-section style="background-color: #4CAF50 !important">
            <div class="text-h6" align="center">USUARIOS</div>
          </q-card-section>
          <q-separator dark />
          <q-card-section id="imgSection">
            <img id="imgCards" src="https://media-public.canva.com/ZD6iE/MAEpzcZD6iE/1/t.png" alt="">
          </q-card-section>
          <q-separator />
          <q-card-actions id="btnSection">
            <q-btn to="/usuario" style="background-color: #4CAF50 !important">BUSCAR</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRightFromBracket)

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  components: {
    'font-awesome-icon': FontAwesomeIcon
  }
};
</script>

<style>
.custom-toolbar-title {
  background-color: #2E7D32;
}

#cards {
  background-color: white !important;
}

#divCards{
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  margin: 0 auto;
}

#imgCards{
  height: 100px;
}

#imgSection , #btnSection{
  display: flex;
  justify-content: center;
}

#btnBack{
  float: right;
  /* width: 5%; */
}

#imgBtnBack{
  width: 20px;
}

.my-card {
  width: 100%;
  max-width: 250px
}
#hr {
  width: 90%;
  height: 5px !important;
  background-color: #2E7D32;
  border: 0px;
}
#tituloPrincipal{
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 10px;
}
</style>