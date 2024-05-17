<template>
    <filter-checkbox-item
        v-if="display"
        ref="filter-checkbox"
        :title="title"
        :selected="selected"
        @clear="onClear"
        @hide="onHide"
        @click="onClick"
    >
        <div class="sticky top-0 bg-white" v-if="searchable">
            <div class="flex items-center px-3 py-2 space-x-2 text-gray-200">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-4 stroke-gray-100">
                        <path
                            d="M14.64 13.36l-4.51-4.51A4.94 4.94 0 0 0 11 6a5 5 0 1 0-2.17 4.12l4.51 4.51zM2.42 6A3.6 3.6 0 1 1 6 9.61 3.6 3.6 0 0 1 2.42 6z"
                        />
                    </svg>
                </div>
                <input
                    ref="input"
                    v-model="searchRequest"
                    class="outline-0 border-0 text-gray-500 font-light"
                    @keyup.down="down"
                    @keyup.up="up"
                    @keyup.enter="enter"
                />
                <div>
                    <x-circle-solid
                        class="w-4 cursor-pointer"
                        :class="{ invisible: searchRequest === '' }"
                        @click="clearSearch"
                    />
                </div>
            </div>
            <hr />
        </div>
        <template v-if="filterWithCursor.length && !loading">
            <v-checkbox
                v-for="filter in filterWithCursor"
                :id="filter.name"
                ref="rows"
                :key="filter.id"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                :class="{ 'bg-gray-300': filter.active }"
                :label="filter.name"
                :description="filter.description"
                :model-value="isChecked(filter.id)"
                @update:model-value="onInput($event, filter.id)"
            />
        </template>
        <div class="relative h-12" v-else-if="loading">
            <loader class="h-8 text-gray-600" />
        </div>
        <div v-else class="text-gray-500 mr-1 font-light text-center">
            {{ $vueAdmin.t('NOTHING_FOUND') }}
        </div>
    </filter-checkbox-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FilterCheckboxItem from './VFilterCheckboxItem.vue';
import XCircleSolid from '../svg/XCircleSolid.vue';
import VCheckbox from '../widgets/VCheckbox.vue';
import Loader from '../../components/svg/Loader.vue';

export default defineComponent({
    name: 'VFilterCheckbox',
    components: { Loader, FilterCheckboxItem, XCircleSolid, VCheckbox },
    props: {
        title: { type: String, required: true },
        filters: { type: Array<any>, required: true },
        modelValue: { type: Array, default: () => [] },
        searchable: { type: Boolean, default: false },
        hideSingleOrEmpty: { type: Boolean, default: true },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            suggestVisible: false,
            searchRequest: '',
            cursor: null as number | null,
            loading: false,
        };
    },
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: Array<any>) {
                this.$emit('update:modelValue', value);
            },
        },
        selected(): Array<any> {
            return this.model.map((item: any) => this.findFilter(item)).filter((item) => item);
        },
        filterWithCursor(): Array<any> {
            return this.foundFilters.map((item, index) => ({ active: index === this.cursor, ...item }));
        },
        foundFilters(): Array<any> {
            return this.filters.filter(
                (item) =>
                    this.searchRequest === null || item.name.toLowerCase().includes(this.searchRequest.toLowerCase()),
            );
        },
        display() {
            return !(this.hideSingleOrEmpty && this.filters.length < 2);
        },
    },
    watch: {
        searchRequest() {
            this.cursor = null;
        },
    },
    methods: {
        findFilter(value: string | number): any {
            /* eslint-disable-next-line eqeqeq */
            return this.filters.find((item) => item.id == value);
        },
        onInput(isChecked: boolean, value: string | number) {
            const { model } = this;
            if (isChecked && !this.isChecked(value)) {
                model.push(value);
            }
            if (!isChecked && this.isChecked(value)) {
                /* eslint-disable-next-line eqeqeq */
                const index = this.model.findIndex((item) => item == value);
                model.splice(index, 1);
            }
            this.$emit('update:modelValue', model);
        },
        onClear(index = null) {
            if (index !== null) {
                this.$emit(
                    'update:modelValue',
                    [...this.modelValue].filter((_, i) => i !== index),
                );
                return;
            }
            this.$emit('update:modelValue', []);
        },
        onHide() {
            this.clearSearch();
        },
        clearSearch() {
            this.searchRequest = '';
        },
        scrollSuggest() {
            if (this.filterWithCursor.length) {
                const ref = (this.$refs['filter-checkbox'] as any).$refs['filter-button'].$refs.suggest;
                ref.scrollTop = (this.cursor as number) * (this.$refs.rows as Array<any>)[0].$el.offsetHeight;
            }
        },
        down() {
            this.cursor = this.cursor !== null && this.foundFilters.length !== this.cursor + 1 ? this.cursor + 1 : 0;
            this.scrollSuggest();
        },
        up() {
            this.cursor = this.cursor !== null && this.cursor > 0 ? this.cursor - 1 : this.foundFilters.length - 1;
            this.scrollSuggest();
        },
        enter() {
            if (this.cursor !== null) {
                this.onInput(!this.isChecked(this.foundFilters[this.cursor].id), this.foundFilters[this.cursor].id);
            }
        },
        isChecked(value: string | number) {
            return this.selected.find((item: any) => item.id === value) !== undefined;
        },
        onClick() {
            (this.$refs.input as any)?.focus();
        },
    },
});
</script>
