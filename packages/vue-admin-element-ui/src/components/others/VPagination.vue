<template>
    <div class="flex items-stretch flex-wrap gap-1">
        <v-button color="white" size="sm" :disabled="currentPage === 1" @click="loadPage(currentPage - 1)">
            <arrow-long-up class="-rotate-90 w-4" />
        </v-button>

        <v-button
            v-for="page in pages"
            :key="page"
            :loading="loading && page === nextPage"
            :size="loading && page === nextPage ? 'sm' : undefined"
            :disabled="page === currentPage"
            @click="loadPage(page)"
        >
            {{ page }}
        </v-button>

        <v-button size="sm" color="white" :disabled="currentPage === lastPage" @click="loadPage(currentPage + 1)">
            <arrow-long-up class="rotate-90 w-4" />
        </v-button>
    </div>
</template>

<script>
import ArrowLongUp from '@/components/svg/ArrowLongUp.vue';
import VButton from '@/components/widgets/VButton.vue';

export default {
    components: { VButton, ArrowLongUp },
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        lastPage: {
            type: Number,
            required: true,
        },
        adjacentPages: {
            type: Number,
            default: 2,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            nextPage: null,
        };
    },
    computed: {
        pages() {
            const pages = [];
            const pageCount = this.lastPage;
            const adjacentPages = this.adjacentPages;

            if (pageCount <= 11) {
                for (let i = 1; i <= pageCount; i++) {
                    pages.push(i);
                }
            } else {
                if (this.currentPage <= adjacentPages + 3) {
                    for (let i = 1; i <= adjacentPages + 5; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(pageCount);
                } else if (this.currentPage >= pageCount - (adjacentPages + 2)) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = pageCount - (adjacentPages + 4); i <= pageCount; i++) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = this.currentPage - adjacentPages; i <= this.currentPage + adjacentPages; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(pageCount);
                }
            }

            return pages;
        },
    },
    methods: {
        loadPage(page) {
            if (typeof page === 'number' && !this.loading && page >= 1 && page <= this.lastPage) {
                this.nextPage = page;
                this.$emit('page-change', page);
            }
        },
    },
};
</script>
