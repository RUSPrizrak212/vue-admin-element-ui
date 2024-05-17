<template>
    <div v-cloak :class="$attrs.class" class="flex flex-col relative">
        <v-label v-if="label" :id="id" :value="label" />
        <div class="flex rounded-md shadow-sm">
            <span
                v-if="addOn"
                class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                :class="
                    hasError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                "
            >
                {{ addOn }}
            </span>

            <div
                class="flex-1 min-w-0 block w-full rounded-non sm:text-sm"
                :class="hasError ? 'border border-red-300' : ''"
            >
                <ckeditor
                    :id="id"
                    v-model="model"
                    :name="name ?? `${id}-name`"
                    :disabled="disabled"
                    tag-name="textarea"
                    :editor="ckeditorEditor"
                    :config="ckeditorConfig"
                    @blur="onBlur"
                />
            </div>
        </div>
        <p v-if="description" :id="`${id}-description`" class="mt-1 text-xs text-gray-500">
            {{ description }}
        </p>
        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CKEClassicEditor, CKEditorComponent } from '@/utils/ckeditor';
import VLabel from './VLabel.vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VInputCkeditor',
    components: { VLabel, ckeditor: CKEditorComponent },
    inheritAttrs: false,
    props: {
        id: { type: String, required: true },
        label: { type: String, default: '' },
        description: { type: String, default: '' },
        modelValue: { type: String, default: '' },
        error: { type: String as PropType<string | null>, default: undefined },
        addOn: { type: String, default: '' },
        name: { type: String, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        imageUploader: { type: Function, default: undefined },
        disabled: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'blur'],
    data() {
        return {
            ckeditorEditor: CKEClassicEditor,
            ckeditorConfig: {
                language: this.$vueAdmin.getLocale(),
                extraPlugins: this.getExtraPlugins(),
                toolbar: {
                    items: this.getToolBarItems(),
                },
            },
        };
    },
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: string) {
                this.entityForm?.errors().clear(this.id);
                this.$emit('update:modelValue', value);
            },
        },
        hasError() {
            return !!this.error;
        },
    },
    methods: {
        getExtraPlugins() {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const vm = this;
            // eslint-disable-next-line @typescript-eslint/ban-types
            const plugins: Function[] = [];

            if (typeof this.imageUploader === 'function') {
                plugins.push(function (editor: any) {
                    editor.plugins.get('FileRepository').createUploadAdapter = (loader: unknown) => {
                        // @ts-expect-error-next-line
                        return vm.imageUploader(loader);
                    };
                });
            }

            return plugins;
        },
        onBlur() {
            this.$emit('blur', this.id);
        },
        getToolBarItems(): string[] {
            let items = [
                'heading',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                'bold',
                'italic',
                'strikethrough',
                'removeFormat',
                '|',
                'alignment',
                'outdent',
                'indent',
                '|',
                'link',
                'bulletedList',
                'numberedList',
                'blockQuote',
                '|',
                'sourceEditing',
            ];

            if (typeof this.imageUploader === 'function') {
                const data: string[] = items.join(':').split('|');
                data[3] = ':insertImage' + data[3];
                items = data.join('|').split(':');
            }

            return items;
        },
    },
});
</script>

<style lang="less" scoped>
:deep(.ck-editor) {
    width: 100%;
}

:deep(.ck-editor .ck-editor__editable) {
    min-height: 5rem;
}
</style>
