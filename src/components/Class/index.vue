<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.query.id);
const test = () => {
    console.log(id.value);

}
</script>

<template>
    <div>
        <button @click="test">点击</button>
    </div>
</template>