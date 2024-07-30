<template>
    <el-config-provider :locale="$vueAdmin.getElLocale()">
        <div :class="$attrs.class" class="flex flex-col">
            <v-label v-if="label" :id="id" :value="label" :required="required" />

            <div class="relative h-10 border" v-if="firstLoading">
                <loader class="h-6 text-gray-600" />
            </div>

            <el-select
                @click="onClickSelect"
                v-show="!firstLoading"
                ref="filter-select"
                :id="id"
                v-model="model"
                :class="{ 'has-error': hasError }"
                :placeholder="placeholder"
                :clearable="clearable"
                :loading="loading"
                :disabled="disabled"
                remote
                filterable
                :remote-method="handleRemoteMethod"
                :remote-show-suffix="remoteShowSuffix"
                size="large"
                @change="itemChange"
                :multiple="multiple"
                v-bind="binds"
            >
                <el-option v-for="item in items" :key="item[valueId]" :label="item[valueName]" :value="item[valueId]" />
            </el-select>

            <div v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
                {{ error }}
            </div>
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ElConfigProvider, ElOption, ElSelect } from 'element-plus';
import VLabel from './VLabel.vue';
import 'element-plus/es/components/select/style/css';
import { IEntityController, IEntityForm, Map } from '@/types';
import _ from 'lodash';
import Loader from '@/components/svg/Loader.vue';

export default defineComponent({
    name: 'VSelectRemote',
    components: {
        Loader,
        ElConfigProvider,
        ElOption,
        ElSelect,
        VLabel,
    },
    inheritAttrs: false,
    props: {
        id: { type: String, required: true },
        label: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        clearable: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        mountedRequest: { type: Boolean, default: true },
        valueId: { type: String, default: 'id' },
        valueName: { type: String, default: 'name' },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        binds: { type: Object as PropType<any>, default: undefined },
        modelValue: { type: [Number, String, Array], default: undefined },
        error: { type: String as PropType<string | null>, default: undefined },
        remoteShowSuffix: { type: Boolean, default: false },
        controller: { type: Object as PropType<IEntityController>, required: true },
        searchKey: { type: String, default: 'search' },
        additionalRequest: { type: Object, default: () => {} },
    },
    emits: ['update:modelValue', 'changeItem'],
    computed: {
        items(): Map[] {
            return this.controller.items();
        },
        model: {
            get() {
                return this.modelValue;
            },
            set(value: number | string) {
                this.entityForm?.errors().clear(this.id);
                this.$emit('update:modelValue', value);
            },
        },
        hasError() {
            return !!this.error;
        },
    },
    data() {
        return {
            firstLoading: true,
            firstClick: false,
            suggest: null as any,
            loading: true,
            scrollTop: 0,
            searchRequest: '',
            debounce: _.debounce(function (context: any) {
                const data = Object.assign({}, context.additionalRequest);

                if (context.searchRequest) {
                    data[context.searchKey] = context.searchRequest;
                }

                context.loading = true;
                context.controller.getItems(data).finally(() => (context.loading = false));
            }, 500),
        };
    },
    async mounted() {
        if (this.mountedRequest) {
            await this.controller.getItems(this.additionalRequest);
            this.firstClick = true;
        }

        this.loading = false;
        this.firstLoading = false;
        this.suggest = (this.$refs['filter-select'] as any)?.scrollbarRef?.wrapRef;
        this.suggest?.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        onClickSelect() {
            if (!this.mountedRequest && !this.firstClick) {
                this.handleRemoteMethod('');
                this.firstClick = true;
            }
        },
        handleRemoteMethod(val: string) {
            if (val === this.searchRequest) {
                return;
            }

            this.searchRequest = val;

            if (!this.loading) {
                this.debounce(this);
            }
        },
        handleScroll() {
            if (this.suggest.scrollTop + this.suggest.clientHeight >= this.suggest.scrollHeight) {
                const nextPage = this.controller.nextPage();
                if (!this.loading && nextPage) {
                    this.controller.getItems({
                        ...this.additionalRequest,
                        page: nextPage,
                        [this.searchKey]: this.searchRequest,
                    });
                }
            }
        },
        itemChange(key: string | number) {
            const name = this.items.find((item) => item[this.valueId] === key);
            this.$emit('changeItem', name);
        },
    },
});
</script>
