<template>
  <div class="inline-flex w-full items-center my-3">
    <label
      v-if="label"
      class="text-gray-600 dark:text-gray-300 text-base mr-2 label text-right"
      :class="{ [formStyle.label]: true }"
    >
      {{ label }}
    </label>
    <div
      class="inline-block relative w-auto"
      :ref="name"
      :class="{ [formStyle.input]: true }"
    >
      <input
        type="text"
        readonly
        :value="display"
        @click="showDatepicker = !showDatepicker"
        @keydown.escape="showDatepicker = false"
        class="bg-white dark:bg-dark-500 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 w-full pl-2 pr-10 py-2 leading-none rounded-sm border-solid border"
        placeholder="Select date"
      />
      <div
        class="bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300 mt-9 rounded-sm shadow-md p-4 absolute top-0 left-0 select-none z-10"
        style="width: 17rem"
        v-show="showDatepicker"
      >
        <div class="flex justify-between items-center mb-2">
          <div>
            <span class="text-lg font-bold">
              {{ $dateFns.format(_date, 'MMMM') }}
            </span>
            <span class="ml-1 text-lg">
              {{ $dateFns.format(_date, 'Y') }}
            </span>
          </div>
          <div>
            <button
              type="button"
              class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full dark:hover:text-gray-600"
              :class="{ 'cursor-not-allowed opacity-25': !canGoPreviousMonth }"
              :disabled="!canGoPreviousMonth"
              @click="goPreviousMonth"
            >
              {{ '<' }}
            </button>
            <button
              type="button"
              class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full dark:hover:text-gray-600"
              :class="{ 'cursor-not-allowed opacity-25': !canGoPreviousMonth }"
              :disabled="!canGoPreviousMonth"
              @click="goNextMonth"
            >
              {{ '>' }}
            </button>
          </div>
        </div>
        <div class="flex flex-wrap mb-3 -mx-1">
          <template v-for="(day, index) in days" :key="index">
            <div style="width: 14.26%" class="px-1">
              <div class="font-medium text-center text-xs">
                {{ day }}
              </div>
            </div>
          </template>
        </div>
        <div class="flex flex-wrap -mx-1">
          <template v-for="day in items" :key="day.index">
            <div style="width: 14.28%" class="px-1 mb-1">
              <div
                @click="setDay(day)"
                class="cursor-pointer text-center text-sm rounded leading-loose transition ease-in-out duration-100 hover:bg-gray-500"
                :class="{
                  'text-gray-400 dark:text-gray-500': day.overflows,
                  'bg-gray-500 text-white': day.isToday
                }"
              >
                {{ day.value }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Watch, Inject } from 'vue-property-decorator';

interface Day {
  index: number,
  value: number,
  month?: number,
  isToday?: boolean,
  overflows?: boolean,
};

@Options({
  name: 'c-input-date'
})
export default class InputDate extends Vue {
  @Prop({}) modelValue!: any;
  @Prop({ default: '' }) label!: string;
  @Inject({ default: { label: '', input: '' } }) formStyle!: any;

  readonly days: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly $dateFns!: any;
  readonly $uuid!: number;

  showDatepicker: boolean = false;
  display: string = '';
  day!: number;
  month!: number;
  year!: number;
  items: Day[] = [];
  _date!: Date;

  get date(): Date {
    return this._date;
  }

  set date(modelValue: Date) {
    this._date = modelValue;

    this.month = this._date.getMonth();
    this.year = this._date.getFullYear();
    this.day = this._date.getDate();
  }

  get name(): string {
    return `date_${this.$uuid}`;
  }

  get canGoPreviousMonth(): boolean {
    return true;
  }

  get canGoNextMonth(): boolean {
    return true;
  }

  updateDisplay() {
    this.display = this.$dateFns.format(this._date, 'yyyy-MM-dd');
  }

  @Watch('modelValue')
  onValueChange() {
    if (this.modelValue) {
      if (typeof this.modelValue === 'object') {
        this.date = this.modelValue;
      } else {
        this.date = new Date(this.modelValue);
        this.$emit('update:modelValue', this._date);
      }

      this.updateDisplay();
    } else {
      this.date = new Date();
    }
  }

  created() {
    document.addEventListener('click', this.off);

    this.onValueChange();
    this.updateItems();
  }

  setDay(day: any) {
    let date = this._date;

    if (day.month) {
      date = day.month > 0
        ? this.$dateFns.addMonths(date, day.month)
        : this.$dateFns.subMonths(date, ~day.month + 1);
    }

    this.date = this.$dateFns.setDate(date, day.value);

    this.$emit('update:modelValue', this._date);
    this.showDatepicker = false;
  }

  isToday(date: number): boolean {
    return new Date().toDateString() === new Date(this.year, this.month, date).toDateString();
  }

  goPreviousMonth() {
    this.date = this.$dateFns.subMonths(this._date, 1);
    this.updateItems();
  }

  goNextMonth() {
    this.date = this.$dateFns.addMonths(this._date, 1);
    this.updateItems();
  }

  updateItems() {
    const daysCurrentMonth = this.$dateFns.getDaysInMonth(this._date);
    const daysLastMonth = this.$dateFns.getDaysInMonth(this.$dateFns.subMonths(this._date, 1));
    const dayOfWeek = new Date(this.year, this.month).getDay();
    const total = 42;

    let index = 1;
    let days: Day[] = [];

    for (let i = daysLastMonth - (dayOfWeek - 1); i <= daysLastMonth; i++) {
      days.push({ index, value: i, overflows: true, month: -1 });
      index++;
    }

    for (let i = 1; i <= daysCurrentMonth; i++) {
      days.push({ index, value: i, isToday: this.isToday(i) });
      index++;
    }

    for (let i = 1; index <= total; i++) {
      days.push({ index, value: i, overflows: true, month: 1 });
      index++;
    }

    this.items = days;
  }

  off(event: any) {
    let targetElement = event.target;
    const container = this.$refs[this.name];

    do {
      if (targetElement === container) {
        event.stopPropagation();

        return;
      }

      targetElement = targetElement.parentNode;
    } while (targetElement);

    this.showDatepicker = false;
  }
}
</script>
