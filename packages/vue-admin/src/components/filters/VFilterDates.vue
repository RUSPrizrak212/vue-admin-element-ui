<template>
    <filter-button-item :clear-button-visible="clearButtonVisible" @clear="clear">
        <template #buttonText>
            <span class="text-gray-500 font-light whitespace-nowrap">{{ title }}</span>
            <template v-if="model[fromField]">
                <span class="text-gray-500 mx-1 font-light">{{ $vueAdmin.t('FROM').toLowerCase() }}</span>
                <span
                    class="truncate px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-0.5"
                >
                    {{ displayDate(model[fromField]) }}
                </span>
            </template>
            <template v-if="model[toField]">
                <span class="text-gray-500 mx-1 font-light">{{ $vueAdmin.t('TO').toLowerCase() }}</span>
                <span
                    class="truncate px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-0.5"
                >
                    {{ displayDate(model[toField]) }}
                </span>
            </template>
        </template>
        <div class="p-4 rounded-full space-y-2">
            <div class="space-y-2">
                <div class="text-gray-500 font-light">{{ title }} {{ $vueAdmin.t('FROM').toLowerCase() }}</div>
                <v-input max="9999-12-12" :id="fromField" v-model="model[fromField]" :type="type" class="my-2" />
            </div>
            <div class="space-y-2">
                <div class="text-gray-500 font-light">{{ title }} {{ $vueAdmin.t('TO').toLowerCase() }}</div>
                <v-input max="9999-12-12" :id="toField" v-model="model[toField]" :type="type" class="my-2" />
            </div>
        </div>
    </filter-button-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FilterButtonItem from './VFilterButtonItem.vue';
import VInput from '../widgets/VInput.vue';

export default defineComponent({
    name: 'VFilterDates',
    components: { FilterButtonItem, VInput },
    props: {
        modelValue: { type: Object, default: () => ({}) },
        fromField: { type: String, required: true },
        toField: { type: String, required: true },
        title: { type: String, required: true },
        type: { type: String, default: 'date' },
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: any) {
                value[this.toField] = this.$vueAdminHelper.validateDate(value[this.toField]);
                value[this.fromField] = this.$vueAdminHelper.validateDate(value[this.fromField]);

                this.$emit('update:modelValue', value);
            },
        },
        clearButtonVisible() {
            if (!this.model) {
                return false;
            }
            return !!this.model[this.fromField] || !!this.model[this.toField];
        },
    },
    methods: {
        clear() {
            this.model[this.fromField] = null;
            this.model[this.toField] = null;
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
