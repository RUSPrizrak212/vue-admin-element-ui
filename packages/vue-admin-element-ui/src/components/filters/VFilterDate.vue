<template>
    <filter-button-item :clear-button-visible="clearButtonVisible" @clear="clear">
        <template #buttonText>
            <span class="text-gray-500 font-light whitespace-nowrap">{{ title }}</span>
            <template v-if="model">
                <span
                    class="truncate px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ml-1 mr-0.5"
                >
                    {{ displayDate(model) }}
                </span>
            </template>
        </template>
        <div class="p-4 rounded-full">
            <div class="space-y-2">
                <div class="text-gray-500 font-light">
                    {{ title }}
                </div>
                <v-input max="9999-12-12" :id="id" v-model="model" :type="type" class="my-2" />
            </div>
        </div>
    </filter-button-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FilterButtonItem from './VFilterButtonItem.vue';
import VInput from '../widgets/VInput.vue';

export default defineComponent({
    name: 'VFilterDate',
    components: { FilterButtonItem, VInput },
    props: {
        modelValue: { type: String, default: undefined },
        id: { type: String, required: true },
        title: { type: String, required: true },
        type: { type: String, default: 'date' },
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: string) {
                this.$emit('update:modelValue', this.$vueAdminHelper.validateDate(value));
            },
        },
        clearButtonVisible() {
            return !!this.model;
        },
    },
    methods: {
        clear() {
            this.model = undefined;
        },
        displayDate(date: string) {
            if (this.type === 'datetime-local') {
                return this.$vueAdminHelper.formatDate(date);
            }

            if (this.type === 'month') {
                return this.$vueAdminHelper.onlyMonthYear(date);
            }

            return this.$vueAdminHelper.onlyDate(date);
        },
    },
});
</script>
