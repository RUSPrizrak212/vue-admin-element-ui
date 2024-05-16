<template>
    <filter-button-item :clear-button-visible="clearButtonVisible" @clear="clear">
        <template #buttonText>
            <span class="text-gray-500 font-light whitespace-nowrap mr-1">{{ localTitle }}</span>
            <template v-if="notEmpty">
                <span
                    class="flex truncate px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-0.5"
                >
                    <div class="mr-0.5">{{ fieldName }}</div>
                    <angle-up v-if="model[directionKey] === 'asc'" width="16px" height="16px" />
                    <angle-down v-else width="16px" height="16px" />
                </span>
            </template>
        </template>
        <div class="p-4 rounded-full space-y-2">
            <div class="space-y-2">
                <div class="text-gray-500 font-light">
                    {{ $vueAdmin.t('FIELD') }}
                </div>
                <v-select
                    id="field"
                    v-model="model[sortKey]"
                    :items="fields"
                    class="my-2"
                    :placeholder="$vueAdmin.t('SELECT_PLACEHOLDER')"
                    @update:model-value="onChange"
                />
            </div>
            <div class="space-y-2">
                <div class="text-gray-500 font-light">
                    {{ $vueAdmin.t('SORT.DIRECTION') }}
                </div>
                <v-select
                    id="direction"
                    v-model="model[directionKey]"
                    :items="directionItems"
                    class="my-2"
                    @update:model-value="onChange"
                />
            </div>
        </div>
    </filter-button-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FilterButtonItem from './VFilterButtonItem.vue';
import AngleUp from '../svg/AngleUp.vue';
import AngleDown from '../svg/AngleDown.vue';
import VSelect from '../widgets/VSelect.vue';

export default defineComponent({
    name: 'VFilterSort',
    components: {
        AngleDown,
        AngleUp,
        FilterButtonItem,
        VSelect,
    },
    props: {
        modelValue: { type: Object, default: () => ({}) },
        title: { type: String, default: undefined },
        fields: { type: Array<any>, required: true },
        sortKey: { type: String, required: true },
        directionKey: { type: String, required: true },
    },
    emits: ['update:modelValue', 'sort'],
    data() {
        return {
            localTitle: this.title ?? this.$vueAdmin.t('SORT.SORTING'),
            directionItems: [
                { id: 'desc', name: this.$vueAdmin.t('SORT.DESC') },
                { id: 'asc', name: this.$vueAdmin.t('SORT.ASC') },
            ],
        };
    },
    computed: {
        model: {
            get() {
                const value = this.modelValue;
                if (!value[this.directionKey]) {
                    value[this.directionKey] = 'desc';
                }

                return value;
            },
            set(value: any) {
                this.$emit('update:modelValue', value);
            },
        },
        notEmpty() {
            return !!this.model[this.sortKey] && !!this.model[this.directionKey];
        },
        fieldName() {
            const key = this.model[this.sortKey];
            return this.fields.find((item: any) => item.id === key).name;
        },
        clearButtonVisible() {
            if (!this.model) {
                return false;
            }
            return this.notEmpty;
        },
    },
    methods: {
        clear() {
            this.model[this.sortKey] = null;
            this.model[this.directionKey] = 'desc';
            this.onChange();
        },
        onChange() {
            if (this.notEmpty) {
                this.$emit('sort', this.model);
            } else {
                this.$emit('sort', {});
            }
        },
    },
});
</script>
