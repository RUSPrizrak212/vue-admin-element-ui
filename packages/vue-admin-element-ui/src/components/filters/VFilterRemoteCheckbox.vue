<template>
    <filter-checkbox-item
        ref="filter-checkbox"
        :title="title"
        :selected="selected"
        :name-value="nameValue"
        @clear="onClear"
        @hide="onHide"
        @click="onClick"
        @scroll-end="handleScroll"
        @button-click="onButtonClick"
    >
        <div class="sticky top-0 bg-white">
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
                    @input="handleInputSearch"
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

        <div class="relative h-12" v-if="loading">
            <loader class="h-8 text-gray-600" />
        </div>
        <template v-else>
            <template v-for="(filter, key) in selected" :key="filter[idValue]">
                <v-checkbox
                    v-if="!ids.includes(filter[idValue] as never)"
                    :id="filter[nameValue]"
                    ref="rows"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                    :class="{ 'bg-gray-300': cursor === key }"
                    :label="filter[nameValue]"
                    :description="filter.description"
                    :model-value="isChecked(filter[idValue])"
                    @update:model-value="onInput($event, filter)"
                    :appear="false"
                />
            </template>
            <v-checkbox
                :id="filter[idValue]"
                v-for="(filter, key) in items"
                :key="filter[idValue]"
                ref="rows"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                :class="{ 'bg-gray-300': cursor === key }"
                :label="filter[nameValue]"
                :description="filter.description"
                :model-value="isChecked(filter[idValue])"
                @update:model-value="onInput($event, filter)"
                :appear="false"
            />
            <div v-if="!items.length" class="text-gray-500 mr-1 font-light text-center">
                {{ $vueAdmin.t('NOTHING_FOUND') }}
            </div>
        </template>
        <div class="h-16 relative" v-if="nextPageLoaded">
            <loader class="h-8 text-gray-600" />
        </div>
    </filter-checkbox-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FilterCheckboxItem from './VFilterCheckboxItem.vue';
import XCircleSolid from '../svg/XCircleSolid.vue';
import VCheckbox from '../widgets/VCheckbox.vue';
import Loader from '../../components/svg/Loader.vue';
import _ from 'lodash';
import { IEntityController, Map } from '@/types';

export default defineComponent({
    name: 'VFilterRemoteCheckbox',
    components: { Loader, FilterCheckboxItem, XCircleSolid, VCheckbox },
    props: {
        title: { type: String, required: true },
        modelValue: { type: Array, default: () => [] },
        searchKey: { type: String, default: 'search' },
        controller: { type: Object as PropType<IEntityController>, required: true },
        idValue: { type: String, default: 'id' },
        nameValue: { type: String, default: 'name' },
        findKey: { type: String, default: 'ids' },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            suggestVisible: false,
            searchRequest: '',
            cursor: null as number | null,
            loading: true,
            page: null as number | null,
            nextPageLoaded: false,
            firstLoad: true,
            selected: [] as Map[],
            debounce: _.debounce(function (vm: any) {
                let data = {};

                if (vm.searchRequest) {
                    data = { [vm.searchKey]: vm.searchRequest };
                }

                vm.loading = true;
                vm.search(data).finally(() => (vm.loading = false));
            }, 500),
        };
    },
    watch: {
        modelValue: {
            async handler(newFilters) {
                if (newFilters.length && this.firstLoad) {
                    await this.search({ [this.findKey]: newFilters });
                    this.selected = Object.assign([], this.items);
                    this.firstLoad = false;
                }
            },
        },
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
        items(): Map[] {
            return this.controller.items();
        },
        ids(): string[] | number[] {
            return this.controller.items().map((item) => item[this.idValue]);
        },
    },
    methods: {
        async handleScroll() {
            const nextPage = this.controller.nextPage();
            if (this.nextPageLoaded || !nextPage) {
                return;
            }

            this.nextPageLoaded = true;
            await this.search({ page: nextPage, [this.searchKey]: this.searchRequest });
            this.nextPageLoaded = false;
        },
        handleInputSearch() {
            if (!this.loading) {
                this.debounce(this);
            }
        },
        findFilter(value: string | number): any {
            /* eslint-disable-next-line eqeqeq */
            return this.items.find((item) => item.id == value);
        },
        onInput(isChecked: boolean, value: Map) {
            const { model, selected, idValue } = this;

            if (isChecked) {
                model.push(value[this.idValue]);
                selected.push(value);
            } else {
                const index = this.model.findIndex((item) => item == value[idValue]);
                selected.splice(index, 1);
                model.splice(index, 1);
            }

            this.$emit('update:modelValue', model);
        },
        onClear(index = null) {
            if (index !== null) {
                this.selected.splice(index, 1);
                this.model.splice(index, 1);
                return;
            }

            this.selected = [];
            this.$emit('update:modelValue', []);
        },
        onHide() {
            this.searchRequest = '';
        },
        async clearSearch() {
            this.searchRequest = '';
            this.loading = true;
            await this.search();
            this.loading = false;
        },
        scrollSuggest() {
            if (this.items.length) {
                const ref = (this.$refs['filter-checkbox'] as any).$refs['filter-button'].$refs.suggest;
                ref.scrollTop = (this.cursor as number) * (this.$refs.rows as Array<any>)[0].$el.offsetHeight;
            }
        },
        down() {
            this.cursor = this.cursor !== null && this.items.length !== this.cursor + 1 ? this.cursor + 1 : 0;
            this.scrollSuggest();
        },
        up() {
            this.cursor = this.cursor !== null && this.cursor > 0 ? this.cursor - 1 : this.items.length - 1;
            this.scrollSuggest();
        },
        enter() {
            if (this.cursor !== null) {
                this.onInput(!this.isChecked(this.items[this.cursor].id), this.items[this.cursor].id);
            }
        },
        isChecked(value: string | number) {
            return this.selected.find((item: any) => item[this.idValue] === value) !== undefined;
        },
        async onClick() {
            (this.$refs.input as any)?.focus();
        },
        async search(params: Map = {}) {
            await this.controller.getItems(params);
        },
        async onButtonClick() {
            this.loading = true;
            await this.search();
            this.loading = false;
        },
    },
});
</script>
