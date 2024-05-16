<template>
    <div class="flex flex-col gap-3 max-w-max">
        <div class="text-[#A3A3A3] self-center">{{ $vueAdmin.t('TODAY') }}: {{ todayLabel }}</div>
        <div class="flex gap-4 self-center">
            <button v-if="isMoveByMonthAllowed(false)" type="button" @click="moveByMonth(false)">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.5498 19.9201L9.0298 13.4001C8.2598 12.6301 8.2598 11.3701 9.0298 10.6001L15.5498 4.08008"
                        stroke="#838A98"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
            <div class="text-lg">
                {{ monthYearLabel }}
            </div>
            <button v-if="isMoveByMonthAllowed(true)" type="button" @click="moveByMonth(true)">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.4502 4.07992L15.9702 10.5999C16.7402 11.3699 16.7402 12.6299 15.9702 13.3999L9.4502 19.9199"
                        stroke="#838A98"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
        <div class="flex p-4 rounded-lg border border-[#D7DAE2]">
            <div class="flex flex-col text-[#656565] gap-2 text-lg">
                <div class="grid grid-cols-7 gap-1 border-b border-[#D9D9D9] pb-2">
                    <div
                        v-for="(week, key) in weeks"
                        :key="key"
                        class="flex flex-col w-[44px] h-[44px] justify-center items-center"
                        :class="{
                            'text-[#DD4444]': week.holiday,
                            'text-black': week.current && !week.holiday,
                            'text-red-600': week.current && week.holiday,
                        }"
                    >
                        {{ week.name }}

                        <v-date-picker-dash v-if="week.current" class="mb-0.5" />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <div v-for="(row, rowKey) in rows" :key="rowKey" class="grid grid-cols-7 gap-1">
                        <div
                            v-for="(cell, columnKey) in row"
                            :key="`${rowKey}.${columnKey}`"
                            class="flex flex-col w-[44px] h-[44px] rounded justify-center items-center duration-300"
                            :class="getCellClasses(cell)"
                            @click="onClick(rowKey, columnKey)"
                        >
                            {{ cell?.text }}

                            <v-date-picker-dash v-if="cell.type === 'today'" class="mb-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import * as _ from 'lodash';
import dayjs from 'dayjs';
import VDatePickerDash from './VDatePickerDash.vue';

export default defineComponent({
    name: 'VDatePicker',
    components: { VDatePickerDash },
    props: {
        modelValue: {
            type: [Object, Array],
            default: () => [],
        },
        date: {
            type: Object,
            default: () => new Date(),
        },
        minDate: {
            type: Object,
            default: null,
        },
        maxDate: {
            type: Object,
            default: null,
        },
        valueFormat: {
            type: String,
            default: 'YYYY-MM-DD',
        },
        disabledDate: {
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            tableRows: [[], [], [], [], [], []],
            lastColumn: 0,
            lastRow: 0,
        };
    },
    emits: ['update:modelValue', 'update:date'],
    computed: {
        model: {
            get() {
                return _.castArray(this.modelValue).map((d) => dayjs(d).startOf('day'));
            },
            set(value) {
                const items = value.map((item) => (this.valueFormat ? item.format(this.valueFormat) : item.toDate()));
                this.$emit('update:modelValue', items);
            },
        },
        localDate: {
            get() {
                return dayjs(this.date);
            },
            set(value) {
                this.$emit('update:date', value.toDate());
            },
        },
        weeks() {
            const day = dayjs().day();
            const { ucfirst } = this.$vueAdminHelper;

            return [...Array(7).keys()]
                .map((weekday) => dayjs().weekday(weekday))
                .map((date) => ({
                    name: ucfirst(date.format('dd')),
                    holiday: [0, 6].includes(date.day()),
                    current: date.day() === day,
                }));
        },
        rows() {
            const offset = this.offsetDay;
            const rows = this.tableRows;
            const dateUnit = 'day';
            const now = dayjs().startOf(dateUnit);
            let count = 1;

            this.buildPickerTable({ row: 6, column: 7 }, rows, {
                now,
                unit: dateUnit,
                relativeDateGetter: (idx) => this.startDate.add(idx - offset, dateUnit),
                setCellMetadata: (...args) => {
                    if (this.setCellMetadata(...args, count)) {
                        count += 1;
                    }
                },
            });

            return rows;
        },
        todayLabel() {
            return dayjs().format('LL');
        },
        monthYearLabel() {
            const month = this.$vueAdminHelper.ucfirst(this.localDate.format('MMMM'));
            const year = this.localDate.format('YYYY');
            return [month, year].join(' ');
        },
        firstDayOfWeek() {
            return this.localDate.localeData().firstDayOfWeek() || 7;
        },
        offsetDay() {
            // Sunday 7(0), cal the left and right offset days, 3217654, such as Monday is -1, the is to adjust the position of the first two rows of dates
            return this.firstDayOfWeek > 3 ? 7 - this.firstDayOfWeek : -this.firstDayOfWeek;
        },
        startDate() {
            const startDayOfMonth = this.localDate.startOf('month');
            return startDayOfMonth.subtract(startDayOfMonth.day() || 7, 'day');
        },
        days() {
            const startOfMonth = this.localDate.startOf('month');
            const startOfMonthDay = startOfMonth.day() || 7; // day of first day
            const dateCountOfMonth = startOfMonth.daysInMonth();

            const dateCountOfLastMonth = startOfMonth.subtract(1, 'month').daysInMonth();

            return {
                startOfMonthDay,
                dateCountOfMonth,
                dateCountOfLastMonth,
            };
        },
    },
    methods: {
        onClick(row, column) {
            const cell = this.rows[row][column];

            if (cell.disabled) return;

            const newDate = this.getDateOfCell(row, column);

            this.model = cell.selected
                ? _.castArray(this.model).filter((d) => d?.valueOf() !== newDate.valueOf())
                : _.castArray(this.model).concat([newDate]);
        },
        getDateOfCell(row, column) {
            const offsetFromStart = row * 7 + column - this.offsetDay;
            return this.startDate.add(offsetFromStart, 'day');
        },
        buildPickerTable(dimension, rows, { now, unit, relativeDateGetter, setCellMetadata }) {
            for (let rowIndex = 0; rowIndex < dimension.row; rowIndex++) {
                const row = rows[rowIndex];
                for (let columnIndex = 0; columnIndex < dimension.column; columnIndex++) {
                    let cell = row[columnIndex];
                    if (!cell) {
                        cell = {
                            row: rowIndex,
                            column: columnIndex,
                            type: 'normal',
                        };
                    }
                    const index = rowIndex * dimension.column + columnIndex;
                    const nextStartDate = relativeDateGetter(index);
                    cell.dayjs = nextStartDate;
                    cell.date = nextStartDate.toDate();
                    cell.timestamp = nextStartDate.valueOf();
                    cell.type = 'normal';

                    const isToday = nextStartDate.isSame(now, unit);

                    if (isToday) {
                        cell.type = 'today';
                    }
                    setCellMetadata?.(cell, { rowIndex, columnIndex });
                    row[columnIndex] = cell;
                }
            }
        },
        setCellMetadata(cell, { columnIndex, rowIndex }, count) {
            const shouldIncrement = this.setDateText(cell, { count, rowIndex, columnIndex });

            const cellDate = cell.dayjs.toDate();
            cell.selected = this.model.find((d) => d.valueOf() === cell.dayjs.valueOf());
            cell.disabled = this.disabledDate?.(cellDate);
            return shouldIncrement;
        },
        setDateText(cell, { count, rowIndex, columnIndex }) {
            const { startOfMonthDay, dateCountOfMonth, dateCountOfLastMonth } = this.days;
            const offset = this.offsetDay;
            if (rowIndex >= 0 && rowIndex <= 1) {
                const numberOfDaysFromPreviousMonth =
                    startOfMonthDay + offset < 0 ? 7 + startOfMonthDay + offset : startOfMonthDay + offset;

                if (columnIndex + rowIndex * 7 >= numberOfDaysFromPreviousMonth) {
                    cell.text = count;
                    return true;
                }
                cell.text =
                    dateCountOfLastMonth - (numberOfDaysFromPreviousMonth - (columnIndex % 7)) + 1 + rowIndex * 7;
                cell.type = 'prev-month';
            } else {
                if (count <= dateCountOfMonth) {
                    cell.text = count;
                } else {
                    cell.text = count - dateCountOfMonth;
                    cell.type = 'next-month';
                }
                return true;
            }
            return false;
        },
        getCellClasses(cell) {
            const classes = [];

            if (['normal', 'today'].includes(cell.type) && !cell.disabled) {
                classes.push('available');
                if (cell.type === 'today') {
                    classes.push('text-black');
                }

                if (cell.selected) {
                    classes.push('rounded');
                    classes.push('border');
                    classes.push('border-[#A0A0A0]');
                }
            } else {
                classes.push('text-[#C1C1C1]');

                if (cell.selected) {
                    classes.push('border');
                    classes.push('border-[#DCDCDC]');
                }
            }

            if (!cell.disabled) {
                classes.push('cursor-pointer');
                classes.push('hover:bg-[#DCDCDC]');
                classes.push('active:bg-[#A0A0A0]');
            }

            return classes.join(' ');
        },
        isMoveByMonthAllowed(forward) {
            const action = forward ? 'add' : 'subtract';
            const date = this.localDate[action](1, 'month');

            if (forward) {
                return this.maxDate ? date.isSameOrBefore(this.maxDate) : true;
            }
            return this.minDate ? date.isSameOrAfter(this.minDate) : true;
        },
        moveByMonth(forward) {
            const action = forward ? 'add' : 'subtract';
            this.localDate = this.localDate[action](1, 'month');
        },
    },
});
</script>
