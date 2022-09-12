import Vue from "vue";

export default Vue.component("form-formatter", {
  functional: true,
  props: {
    option: {
      type: Object,
      require: true,
    },
    model: Object,
    formatter: Function,
  },
  render(h, self) {
    let formatter = self.props.formatter || self.props.option.formatter;
    return formatter(h, {
      option: self.props.option,
      model: self.props.model,
    });
  },
});
