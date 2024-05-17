<template>
    <div class="mb-5">
        <component :is="icon" v-if="icon" class="inline-block mr-1" />
        <span class="subheader-text">{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VSubheader',
    props: {
        icon: { type: String, default: undefined },
        text: { type: String, default: undefined },
    },
});
</script>

<style scoped>
.subheader-text {
    font-weight: 700;
    font-size: 12px;
    line-height: 12px;
    color: #070707;
}
</style>
