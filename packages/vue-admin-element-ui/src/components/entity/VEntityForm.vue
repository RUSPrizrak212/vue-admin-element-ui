<template>
    <modal :title="title" @close="onClose">
        <loader v-if="loading" position="center-relative" class="w-20 text-gray-600 py-8" />
        <form v-else class="w-full flex flex-col items-center" @submit.prevent="onSubmit">
            <entity-form-tabs
                v-if="formConfig.tabs.length !== 1"
                :tabs="formConfig.tabs"
                :errors="errors"
                class="w-full mb-6"
                @select-tab="currentTab = $event"
            />

            <div v-for="(tab, index) in formConfig.tabs" :key="tab.name" class="w-full">
                <div
                    v-show="currentTab === index"
                    :class="tab.fields.length > 4 ? 'grid grid-cols-2 gap-2' : 'space-y-3'"
                >
                    <template v-for="field in tab.fields" :key="field.key">
                        <component
                            :is="field.component"
                            v-bind="getProps(item, field)"
                            v-if="getVisibility(item, field)"
                            v-model="form[field.key]"
                            v-model:deleted="form[field.deleteKey]"
                            v-model:format-error="formatError"
                            @blur="onBlur"
                            :class="field.class"
                        />
                    </template>
                </div>
            </div>

            <div class="flex space-x-2 pt-7 self-end">
                <v-button color="white" size="sm" @click="onClose">
                    {{ $vueAdmin.t('CANCEL') }}
                </v-button>
                <v-button
                    size="sm"
                    type="submit"
                    :loading="loading"
                    :color="formatError ? 'disabled' : ''"
                    :disabled="formatError || submitDisabled"
                >
                    {{ $vueAdmin.t('SAVE') }}
                </v-button>
            </div>
        </form>
    </modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Modal from '../others/VModal.vue';
import Loader from '../svg/Loader.vue';
import EntityFormTabs from './VEntityFormTabs.vue';
import VButton from '../widgets/VButton.vue';
import { IEntityForm, Map } from '@/types';
import Errors from '../../classes/Errors';

export default defineComponent({
    name: 'VEntityForm',
    components: {
        EntityFormTabs,
        Loader,
        Modal,
        VButton,
    },
    props: {
        formConfig: { type: Object as any, required: true },
        itemId: { type: [String, Number] as PropType<string | number | null>, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, required: true },
        init: { type: Function, default: undefined },
    },
    emits: ['create', 'update', 'close'],
    data() {
        return {
            form: {} as Map,
            currentTab: 0,
            loading: false,
            buttonLoading: false,
            formatError: false,
        };
    },
    computed: {
        title(): any {
            return this.entityForm.title(!!this.itemId);
        },
        item(): any {
            return this.entityForm.item();
        },
        errors(): Errors {
            return this.entityForm.errors();
        },
        submitDisabled(): boolean {
            return this.formConfig.submitDisabled === true;
        },
    },
    async created() {
        this.loading = true;
        await this.entityForm.resetItem();

        if (this.itemId) {
            this.entityForm.getItem(this.itemId).then(async () => {
                await this.prepareForm();
                this.loading = false;
            });
        } else {
            await this.prepareForm();
            this.loading = false;
        }
    },
    methods: {
        getProps(item: any, field: any) {
            let extra = field.props || {};
            if (typeof extra === 'function') {
                extra = extra(item, this.form);
            }

            return {
                error: extra.id ? this.errors.get(extra.id) : undefined,
                ...extra,
                item: item,
                form: this.form,
                entityForm: this.entityForm,
            };
        },
        getVisibility(item: any, field: any): boolean {
            if (typeof field.visibility === 'function') {
                return field.visibility(item, this.form);
            }

            return field.visibility ?? true;
        },
        async prepareForm() {
            if (this.init) {
                await this.init();
            }

            this.formConfig.tabs.forEach((tab: any) => {
                tab.fields.forEach((item: any) => {
                    let { value } = item;
                    if (this.itemId) {
                        if (item.editKey) {
                            value = item.editKey
                                .split('.')
                                .reduce((o: Array<any>, i: number) => (o ? o[i] : null), this.item);
                        } else {
                            value = this.item[item.key] ?? null;
                        }

                        if (item.flatKey) {
                            value = value.map((val) => val[item.flatKey] ?? val);
                        }
                    }
                    if (item.deleteKey) {
                        this.form[item.deleteKey] = [];
                    }

                    this.form[item.key] = value;
                });
            });
        },
        async onBlur(fieldKey: string) {
            await this.entityForm.validate(fieldKey, this.form);
        },
        async onSubmit() {
            this.buttonLoading = true;

            let action: Promise<void>;
            if (this.itemId) {
                action = this.entityForm.updateItem(this.form);
            } else {
                action = this.entityForm.createItem(this.form);
            }

            action
                .then(() => {
                    const event = this.itemId ? 'update' : 'create';
                    this.$emit(event);
                    this.onClose();
                })
                .catch(() => {
                    //
                })
                .finally(() => {
                    this.buttonLoading = false;
                });
        },
        onClose() {
            this.$emit('close');
        },
    },
});
</script>
