<template>
    <q-card class="card">
      <q-card-section class="titulo">
        <div>ASISTENCIA</div>
      </q-card-section>
      <q-card-actions class="actions">
        <img class="logo" src="https://www1.funcionpublica.gov.co/documents/28587425/42384076/logoSena.png/b8131ab9-4c1f-4ef9-8dd4-569d6b7169b6?t=1701956509586" />
        <h2>APRENDIZ</h2>
        <q-form @submit="guardar" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="document"
            label="Documento"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Por favor, dígite su documento']"
            @keyup.enter="guardar"
          />
          <div>
            <q-btn class="btn" label="Registrarse" color="green" type="submit" />
          </div>
        </q-form>
      </q-card-actions>
    </q-card>
    <!-- <div v-if="mensaje" class="mensaje">{{ mensaje }}</div> -->
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Definir documentos válidos para pruebas
  const documentosValidos = ["123456789",];
  
  let document = ref("");
  let mensaje = ref("");
  
  function guardar() {
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
  </style>