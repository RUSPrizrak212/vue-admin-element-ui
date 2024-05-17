<template>
    <div>
        <div class="space-y-2 flex flex-col">
            <h3 class="text-sm font-medium text-gray-700 leading-tight tracking-normal">
                {{ label }}
            </h3>
            <div v-for="(lang, index) in Object.keys(value)" :key="lang">
                <div class="relative">
                    <v-input-ckeditor
                        v-if="ckeditor"
                        :id="`${id}.${lang}`"
                        :model-value="value[lang]"
                        class="flex-grow"
                        :add-on="getAddon(lang)"
                        :error="entityForm?.errors().get(`${id}.${lang}`) ?? null"
                        :entity-form="entityForm"
                        @update:modelValue="onInput($event, lang)"
                        @blur="$emit('blur', `${id}.${lang}`)"
                    />
                    <v-input
                        v-else
                        :id="`${id}.${lang}`"
                        :model-value="value[lang]"
                        class="flex-grow"
                        :multiline="multiline"
                        :add-on="getAddon(lang)"
                        :type="type"
                        :required="required"
                        :maxlength="maxlength"
                        :error="entityForm?.errors().get(`${id}.${lang}`) ?? null"
                        :entity-form="entityForm"
                        @update:modelValue="onInput($event, lang)"
                        @blur="$emit('blur', `${id}.${lang}`)"
                    />
                    <trash-icon
                        v-if="index !== 0"
                        class="w-5 h-5 absolute -right-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-indigo-500 hover:text-indigo-600"
                        @click="deleteLanguage(lang)"
                    />
                </div>
            </div>
        </div>
        <div v-if="languagesItems.length" class="flex justify-end">
            <v-input-multilingual-selector :placeholder="$vueAdmin.t('ADD_LANGUAGE')">
                <template #default="{ hiddenDropDown }">
                <span
                    v-for="item in languagesItems"
                    :id="item.id"
                    :key="item.id"
                    class="p-2 font-light cursor-pointer hover:bg-gray-100 text-gray-700"
                    @click="selectLanguages(item.id, hiddenDropDown)"
                >
                    {{ item.name }}
                </span>
                </template>
            </v-input-multilingual-selector>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import VInputMultilingualSelector from './VInputMultilingualSelector.vue';
import VInputCkeditor from '@/components/widgets/VInputCkeditor.vue';
import VInput from '@/components/widgets/VInput.vue';

export default defineComponent({
    name: 'VInputMultilingual',
    inheritAttrs: false,
    components: {
        VInputCkeditor,
        VInput,
        VInputMultilingualSelector,
        TrashIcon,
    },
    props: {
        languages: { type: Array, required: true },
        label: { type: String, required: true },
        id: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        modelValue: { type: Object, default: undefined },
        required: { type: Boolean, default: false },
        multiline: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        entityForm: { type: Object, default: undefined },
        maxlength: { type: Number, default: 255 },
        ckeditor: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'blur'],
    data() {
        return {
            value: {
                en: '',
            },
        };
    },
    computed: {
        languagesItems() {
            return this.languages.filter((item) => !Object.keys(this.value).includes(item.iso2));
        },
    },
    created() {
        if (Object.keys(this.modelValue).length) {
            this.value = this.modelValue;
        }
    },
    methods: {
        selectLanguages(id, hiddenDropdown) {
            const language = this.languages.find((lang) => lang.id === id);
            this.value[language.iso2] = '';
            hiddenDropdown();
        },
        deleteLanguage(lang) {
            delete this.value[lang];
        },
        onInput(event, lang) {
            this.value[lang] = event;
            this.$emit('update:modelValue', this.value);
        },
        getAddon(lang) {
            return this.languages.find((language) => language.iso2 === lang).name;
        },
    },
});
</script>
