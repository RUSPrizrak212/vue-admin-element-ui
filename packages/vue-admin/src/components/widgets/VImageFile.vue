<template>
    <div>
        <div class="space-y-2 flex flex-col">
            <div v-for="(file, index) in files" :key="file">
                <div class="flex items-center relative space-x-4 bg-indigo-50 rounded px-2 py-1">
                    <v-file
                        :id="`${id}_${index}`"
                        class="flex-grow"
                        :label="label"
                        :accept="accept"
                        @update:model-value="onSelect($event, index)"
                    />
                    <img v-if="images[index]" :src="images[index]" class="w-20" alt="" />
                    <trash
                        v-if="files[0] !== ''"
                        class="w-5 h-5 absolute -right-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-indigo-500 hover:text-indigo-600"
                        @click="deleteItem(index)"
                    />
                </div>
                <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
                    {{ error }}
                </p>
            </div>
        </div>
        <div v-if="multiselect" class="text-right">
            <button
                type="button"
                class="inline-block text-xs pointer text-indigo-500 hover:text-indigo-600"
                @click="addMore"
            >
                {{ $vueAdmin.t('ADD_MORE') }}
            </button>
        </div>
        <div v-if="editImages" class="grid grid-cols-5 mt-4">
            <div
                v-for="(image, index) in editImages"
                :key="image.id"
                class="flex items-center justify-end relative space-x-4 rounded px-3 py-2"
            >
                <img :src="image.src" class="w-20 shadow-md" alt="" />
                <x-circle-solid
                    class="w-5 h-5 absolute right-0 top-0 cursor-pointer text-red-400 hover:text-red-500"
                    @click="deleteEditItem(index, image.id)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import XCircleSolid from '../svg/XCircleSolid.vue';
import Trash from '../svg/Trash.vue';
import VFile from './VFile.vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VImageFile',
    components: { Trash, XCircleSolid, VFile },
    props: {
        label: { type: String, required: true },
        id: { type: String, required: true },
        required: { type: Boolean, default: false },
        multiselect: { type: Boolean, default: false },
        modelValue: { type: Array, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        error: { type: String, default: undefined },
        accept: { type: String, default: undefined },
    },
    emits: ['update:modelValue', 'update:deleted'],
    data() {
        return {
            files: [''] as Array<any>,
            images: [] as Array<any>,
            editImages: [] as Array<any>,
            deletedItem: [] as Array<any>,
        };
    },
    computed: {
        hasError() {
            return !!this.error;
        },
    },
    created() {
        if (this.modelValue) {
            this.modelValue.forEach((image) => this.editImages.push(image));
            this.$emit('update:modelValue', []);
        }
    },
    methods: {
        deleteItem(index: number) {
            if (this.files.length === 1) {
                this.files[index] = '';
                this.images = [];
                return;
            }
            this.files.splice(index, 1);
            this.images.splice(index, 1);
        },
        deleteEditItem(index: number, id: string | number) {
            this.deletedItem.push(id);
            this.editImages.splice(index, 1);
            this.$emit('update:deleted', this.deletedItem);
        },
        onSelect(file: any, index: number) {
            this.entityForm?.errors().clear(this.id);
            this.files[index] = file;
            this.$emit('update:modelValue', this.files);
            this.formatImage();
        },
        addMore() {
            this.files.push('');
        },
        formatImage() {
            this.images = [];
            this.files.forEach((file: any) => {
                if (!file.type.match('image.*')) {
                    return;
                }

                const reader = new FileReader();

                reader.onload = (e: any) => {
                    this.images.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        },
    },
});
</script>
