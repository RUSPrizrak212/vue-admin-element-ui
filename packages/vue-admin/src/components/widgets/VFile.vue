<template>
    <div>
        <div class="col-span-2 flex justify-between bg-indigo-50 p-2">
            <label
                :for="id"
                class="cursor-pointer flex space-x-2 group text-indigo-500 hover:text-indigo-600 transition"
            >
                <span>
                    {{ label }}
                </span>
                <upload class="w-4 text-indigo-400 group-hover:text-indigo-600 transition" />
            </label>
            <input
                :id="id"
                class="hidden"
                name="file"
                type="file"
                :required="required"
                :accept="accept"
                @change="loadFile"
            />
            <div v-if="modelValue" class="flex space-x-1 items-center">
                <span class="text-gray-700">{{ modelValue.name }}</span>
                <folder class="w-6 text-yellow-600" />
            </div>
        </div>
        <div v-if="description">
            <span class="text-sm font-light text-gray-500">{{ description }}</span>
        </div>
        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Upload from '../svg/Upload.vue';
import Folder from '../svg/Folder.vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VFile',
    components: { Folder, Upload },
    props: {
        label: { type: String, required: true },
        id: { type: String, required: true },
        required: { type: Boolean, default: false },
        modelValue: { type: File, default: undefined },
        accept: { type: String, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        description: { type: String, default: '' },
        error: { type: String as PropType<string | null>, default: undefined },
    },
    emits: ['update:modelValue'],
    computed: {
        hasError() {
            return !!this.error;
        },
    },
    methods: {
        loadFile(event: any) {
            this.entityForm?.errors().clear(this.id);
            this.$emit('update:modelValue', event.target.files[0]);
        },
    },
});
</script>
