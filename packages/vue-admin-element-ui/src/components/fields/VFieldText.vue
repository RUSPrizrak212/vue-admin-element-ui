<template>
    <div class="flex space-x-2">
        <template v-if="truncating && hidden">
            {{ truncated }}
        </template>
        <template v-else>
            {{ value }}
        </template>
    </div>
    <div v-if="truncating" class="cursor-pointer text-indigo-500 hover:text-indigo-600" @click="onClick">
        {{ hidden ? $vueAdmin.t('TRUNCATE.SHOW') : $vueAdmin.t('TRUNCATE.HIDE') }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VFieldText',
    inheritAttrs: false,
    props: {
        value: { type: String, required: true },
        maxlength: { type: Number, default: 255 },
        suffix: { type: String, default: '...' },
    },
    data() {
        return {
            hidden: true,
        };
    },
    computed: {
        truncating() {
            return this.value.length > this.maxlength;
        },
        truncated() {
            return this.truncate(this.value, this.suffix);
        },
    },
    methods: {
        truncate(text: string, suffix: string) {
            if (this.truncating) {
                return text.substring(0, this.maxlength) + suffix;
            }
            return text;
        },
        onClick() {
            this.hidden = !this.hidden;
        },
    },
});
</script>
