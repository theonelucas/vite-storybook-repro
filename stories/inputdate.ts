// @ts-nocheck

import InputDate from '@/components/Ui/Form/InputDate.vue';

export default {
  components: { InputDate },
  title: 'Form/Date',
};

const Template1 = (args) => ({
  components: { InputDate },
  setup() {
    return { args };
  },
  template: `<c-input-date v-model="value" @change="change" />`,
});

export const SingleDate = Template1.bind({});
SingleDate.args = {
  value: '',
  change: (date) => {}
};
