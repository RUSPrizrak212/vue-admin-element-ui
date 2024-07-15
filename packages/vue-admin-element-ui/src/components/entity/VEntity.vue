<template>
    <div>
        <div v-if="title || canCreate || $slots.header" class="flex space-x-2 items-center mb-4">
            <h3 v-if="title" class="text-gray-700 text-lg font-light">
                {{ title }}
            </h3>

            <button
                v-if="canCreate"
                type="button"
                class="rounded-full shadow-sm text-white transition bg-green-500 hover:bg-green-400"
                @click="openNewEntityForm"
            >
                <plus class="w-5" />
            </button>

            <slot name="header" />
        </div>
        <slot name="before-table"></slot>

        <loader v-if="loading" v-bind="loader" />
        <div v-else>
            <div
                v-if="$slots['header-two-left'] || $slots['header-two-right'] || showTotal || showFilterSort"
                class="flex py-2 space-x-2"
            >
                <div
                    v-if="$slots['header-two-left'] || showFilterSort"
                    class="flex grow justify-start space-x-2 my-auto"
                >
                    <filter-sort
                        v-if="showFilterSort"
                        v-model="localSort"
                        :fields="sortWidgetFieldItems"
                        sort-key="active"
                        direction-key="direction"
                        @sort="onSortTable"
                    />

                    <slot name="header-two-left" />
                </div>

                <div v-if="$slots['header-two-right'] || showTotal" class="flex grow justify-end space-x-2 my-auto">
                    <slot name="header-two-right" />

                    <div v-if="showTotal" class="text-gray-400">{{ $vueAdmin.t('TOTAL') }}: {{ total }}</div>
                </div>
            </div>
            <div class="overflow-x-auto">
                <div class="entity-table-wrapper inline-block min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <entity-table
                        :fields="fields"
                        :sort="localSort"
                        :components="components"
                        :preprocesses="preprocesses"
                        :can-view="canView"
                        :can-edit="canEdit"
                        :can-delete="canDelete"
                        :controller="controller"
                        @edit="onEditTable"
                        @sort="onSortTable"
                    />
                </div>
            </div>
            <div v-if="useCursorPagination" class="flex justify-center">
                <v-button v-if="nextPage" color="white" :loading="nextPageLoading" @click="loadItems(nextPage)">
                    {{ $vueAdmin.t('MORE') }}
                </v-button>
            </div>
            <div v-else-if="!loading" class="flex justify-center mt-2">
                <v-pagination
                    @page-change="loadItems"
                    :loading="nextPageLoading"
                    :adjacent-pages="adjacentPages"
                    :last-page="lastPage"
                    :current-page="currentPage"
                />
            </div>
        </div>
        <entity-form
            v-if="formVisible"
            :form-config="formConfig"
            :item-id="editItemId"
            :entity-form="controller.form()!"
            :init="onInitEntity"
            @close="onCloseEntityForm"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import EntityTable from './VEntityTable.vue';
import EntityForm from './VEntityForm.vue';
import Loader from '../svg/Loader.vue';
import VButton from '../widgets/VButton.vue';
import Plus from '../svg/Plus.vue';
import FilterSort from '../filters/VFilterSort.vue';
import { IEntityController } from '@/types';
import VPagination from '@/components/others/VPagination.vue';

export default defineComponent({
    name: 'VEntity',
    components: {
        VPagination,
        FilterSort,
        Plus,
        VButton,
        Loader,
        EntityForm,
        EntityTable,
    },
    props: {
        title: { type: String, default: undefined },
        fields: { type: Array, default: undefined },
        sort: { type: Object, default: undefined },
        filters: { type: Object, default: undefined },
        components: { type: Array, default: undefined },
        preprocesses: { type: Array, default: undefined },
        adjacentPages: { type: Number, default: 2 },
        canCreate: { type: Boolean, default: false },
        canView: { type: Boolean, default: false },
        canEdit: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false },
        showTotal: { type: Boolean, default: false },
        useCursorPagination: { type: Boolean, default: true },
        entityFormInit: { type: Function, default: undefined },
        formConfig: { type: Object, default: undefined },
        loader: {
            type: Object,
            default: () => ({
                position: 'center-screen',
                class: 'w-20 text-gray-600',
            }),
        },
        controller: {
            type: Object as PropType<IEntityController>,
            required: true,
        },
    },
    emits: ['sort'],
    data() {
        return {
            loading: true,
            nextPageLoading: false,
            formVisible: false,
            editItemId: undefined as number | undefined,
            localSort: this.sort,
            localFilters: this.filters,
        };
    },
    computed: {
        showFilterSort() {
            return this.localSort?.type === 'filter';
        },
        sortWidgetFieldItems() {
            return this.localSort?.fields.map((item: any) => ({
                id: item.value,
                name: item.title,
            }));
        },
        total() {
            return this.controller.total();
        },
        currentPage() {
            return this.controller.currentPage();
        },
        lastPage() {
            return this.controller.lastPage();
        },
        nextPage() {
            return this.controller.nextPage();
        },
    },
    methods: {
        async loadItems(page?: number) {
            const params = { ...this.localFilters };
            if (page) {
                params.page = page;
                this.nextPageLoading = true;
            } else {
                this.loading = true;
            }

            await this.controller.getItems(params);
            this.nextPageLoading = false;
            this.loading = false;
        },
        setFilters(values: object) {
            this.localFilters = { ...values };
        },
        openNewEntityForm() {
            this.editItemId = undefined;
            this.formVisible = true;
        },
        onEditTable(id: number) {
            this.editItemId = id;
            this.formVisible = true;
        },
        onSortTable(sort: any) {
            this.localFilters!.sort = sort.active;
            this.localFilters!.sort_direction = sort.direction;
            this.loadItems();
            this.$emit('sort', {
                sort: sort.active,
                sort_direction: sort.direction,
            });
        },
        async onInitEntity() {
            if (this.entityFormInit) {
                await this.entityFormInit();
            }
        },
        onCloseEntityForm() {
            this.formVisible = false;
        },
    },
});
</script>
