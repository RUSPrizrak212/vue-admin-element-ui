<template>
    <div>
        <div class="space-y-2 flex flex-col">
            <h3 class="text-sm font-medium text-gray-700 leading-tight tracking-normal">
                {{ label }}
            </h3>
            <div v-for="(item, index) in selected" :key="item">
                <div class="relative">
                    <v-select
                        :id="`${id}_${index}`"
                        v-model="selected[index]"
                        :items="items"
                        :placeholder="placeholder"
                        :clearable="clearable"
                        :filterable="filterable"
                        class="flex-grow"
                        :remote="remote"
                        :remote-method="remoteMethod"
                        :remote-show-suffix="remoteShowSuffix"
                        @update:model-value="onSelect"
                    />
                    <trash
                        v-if="selected.length > 1"
                        class="w-5 h-5 absolute -right-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-indigo-500 hover:text-indigo-600"
                        @click="deleteItem(index)"
                    />
                </div>
                <p
                    v-if="entityForm && entityForm.errors().has(`${id}.${index}`)"
                    :id="`${id}-error`"
                    class="mt-1 text-sm text-red-600"
                >
                    {{ entityForm.errors().get(`${id}.${index}`) }}
                </p>
            </div>
        </div>

        <div class="text-right flex-end">
            <button
                type="button"
                class="inline-block text-xs pointer text-indigo-500 hover:text-indigo-600"
                @click="addMore"
            >
                {{ $vueAdmin.t('ADD_MORE') }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Trash from '../svg/Trash.vue';
import VSelect from './VSelect.vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VSelectMultiple',
    components: { Trash, VSelect },
    props: {
        label: { type: String, required: true },
        id: { type: String, required: true },
        required: { type: Boolean, default: false },
        placeholder: { type: String, default: '' },
        clearable: { type: Boolean, default: false },
        filterable: { type: Boolean, default: false },
        items: { type: Array<any>, required: true },
        modelValue: { type: Array, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        remote: { type: Boolean, default: false },
        remoteShowSuffix: { type: Boolean, default: false },
        remoteMethod: { type: Function, required: false },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            selected: [] as Array<any>,
        };
    },
    created() {
        if (this.modelValue?.length) {
            this.selected = this.modelValue;
            this.onSelect();
            return;
        }
        this.selected.push(this.required ? this.items[0]?.id : null);
        this.onSelect();
    },
    methods: {
        deleteItem(index: number) {
            this.selected.splice(index, 1);
            this.entityForm?.errors().clear(this.id);
            this.onSelect();
        },
        onSelect() {
            this.$emit(
                'update:modelValue',
                this.selected.filter((i) => i),
            );
        },
        addMore() {
            this.selected.push(this.required ? this.items[0]?.id : null);
            this.onSelect();
        },
    },
});
</script>
