<template>
    <div :class="$attrs.class" class="flex-col flex flex-1">
        <div
            class="flex-1 flex items-center bg-white border shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 sm:text-sm border-gray-300 px-2 rounded-full"
        >
            <div v-if="model.length" class="flex space-x-1 pl-2 overflow-x-auto scrollbar">
                <div
                    v-for="(text, index) in model"
                    :key="text"
                    class="inline-flex items-center pl-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                    <span>{{ text }}</span>
                    <button
                        class="ml-1 p-1 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 transition"
                        @click="deleteItem(index)"
                    >
                        <cross class="w-3" />
                    </button>
                </div>
            </div>
            <input
                v-model="inputText"
                class="px-3 border-0 border-transparent text-base flex-grow min-w-min focus:outline-none focus:ring-0 rounded-full text-gray-700 placeholder-gray-500"
                type="text"
                :placeholder="placeholder"
                @keydown="onKeyDown"
                @blur="onBlur"
            />
            <x-circle-solid
                v-if="model.length"
                class="flex-shrink-0 ml-auto w-4 text-gray-300 hover:text-gray-400 cursor-pointer transition"
                @click="clearInput"
            />
        </div>
        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import XCircleSolid from '../svg/XCircleSolid.vue';
import Cross from '../svg/Cross.vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VInputMultiple',
    components: { Cross, XCircleSolid },
    inheritAttrs: false,
    props: {
        id: { type: String, required: true },
        placeholder: { type: String, default: '' },
        modelValue: { type: Array, default: () => [] },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        error: { type: String as PropType<string | null>, default: undefined },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            inputText: '',
        };
    },
    computed: {
        model: {
            get(): Array<any> {
                return this.modelValue;
            },
            set(value: Array<any>) {
                this.entityForm?.errors().clear(this.id);
                this.$emit('update:modelValue', value);
            },
        },
        hasError() {
            return !!this.error;
        },
    },
    methods: {
        onBlur() {
            if (this.inputText) {
                const { model } = this;
                model.push(this.inputText);
                this.$emit('update:modelValue', model);
                this.inputText = '';
            }
        },
        deleteItem(index: number) {
            const { model } = this;
            model.splice(index, 1);
            this.$emit('update:modelValue', model);
        },
        onKeyDown(event: any) {
            const { model } = this;
            if (event.key === 'Backspace' && this.model.length && !this.inputText) {
                model.pop();
            }
            if (event.key === 'Enter') {
                if (this.inputText !== '') {
                    model.push(this.inputText);
                    this.inputText = '';
                }
            }
            this.$emit('update:modelValue', model);
        },
        clearInput() {
            this.$emit('update:modelValue', []);
        },
    },
});
</script>

<style scoped>
.scrollbar::-webkit-scrollbar {
    width: 0;
    height: 0;
}
</style>
