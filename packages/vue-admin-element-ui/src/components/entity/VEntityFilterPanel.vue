<template>
    <div class="flex flex-col space-y-2">
        <div class="flex gap-x-4 flex-wrap gap-y-2">
            <v-input-multiple
                id="entity-filter-panel-search"
                v-model="model[inputKey]"
                :placeholder="localInputPlaceholder"
            />
            <v-button class="inline-block w-fit" :disabled="disabled" :loading="loading" @click="onSearch">
                {{ localButtonText }}
            </v-button>
        </div>

        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VInputMultiple from '../widgets/VInputMultiple.vue';
import VButton from '../widgets/VButton.vue';

export default defineComponent({
    name: 'VEntityFilterPanel',
    components: {
        VInputMultiple,
        VButton,
    },
    props: {
        filters: { type: Object, required: true },
        disabled: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        inputKey: { type: String, default: 'strings' },
        inputPlaceholder: { type: String, default: undefined },
        buttonText: { type: String, default: undefined },
    },
    emits: ['search'],
    data() {
        return {
            model: this.filters,
            localInputPlaceholder: this.inputPlaceholder ?? this.$vueAdmin.t('FILTERS.STRING'),
            localButtonText: this.buttonText ?? this.$vueAdmin.t('SEARCH'),
        };
    },
    methods: {
        onSearch() {
            this.$emit('search', this.model);
        },
        setFilters(values: object) {
            this.model = values;
        },
    },
});
</script>
