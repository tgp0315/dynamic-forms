import Vue from "vue";
import {
  processingNameSlot,
  processingEnum,
  // getValue,
  bindEvent,
  parseExpressions,
} from "./utils";

export default Vue.component("render-item", {
  inject: [
    "options",
    "validateField",
    "clearValidate",
    "resetForm",
    // "setFormData",
    "context",
    "injectComponent",
  ],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      expressionMap: {},
      option: {},
    };
  },
  render(h) {
    let that = this;
    // 表达式应该是仅限 显示隐藏 组件属性 标签属性等 不包括插槽
    parseExpressions.bind(this)(this.item, this.expressionMap);
    const renderInstance = (h, conf) => {
      const {
        // formatter是注册在外部的组件
        tag,
        key,
        formatter = null,
        nameSlots = {},
        // 下面这一堆是否放到一个对象里面？因为它们是组件的各种属性
        props = {},
        style = {},
        staticClass = "",
        className = {},
        domProps = {},
        attrs = {},
        on = {},
        ref,
        id,
        nativeOn = {},
        // 子集
        children = [],
        // 枚举子类 内部封装 radio select button
        enums,
      } = conf || {};
      // 事件处理 原生事件与组件的事件
      let onMap = bindEvent.bind(this)(on) || {};
      let nativeOnMap = bindEvent.bind(this)(nativeOn) || {};
      // 组件属性集合
      // 增加原生事件
      const componentData = {
        props: {
          ...props,
          value: that.formData[key],
        },
        style,
        staticClass,
        class: className,
        attrs:
          tag === "el-date-picker"
            ? {
                // TODO 这里应该做判断，增加一个标识，是否需要透传到attrs里面，props
                ...attrs,
                ...this.$attrs,
                ...props, //  el-date-picker有问题，因为它是拿的attrs
                id: id || props.id,
              }
            : {
                ...attrs,
                ...this.$attrs,
                id: id || props.id,
              },
        ref,
        domProps,
        on: {
          ...onMap,
          ...this.$listeners,
        },
        nativeOn: {
          ...nativeOnMap,
        },
      };
      // const { value } = getValue(key, this.formData);
      // 处理双向绑定 在有值的时候
      key &&
        Object.assign(componentData, {
          // attrsMap: {
          //   "v-model": value,
          // },
          model: {
            value: that.formData[key],
            expression: `formData[${key}]`,
            callback: function (val) {
              // that.setFormData(key, val);
              that.formData[key] = val;
            },
          },
        });

      // 全局属性的添加处理
      this.globalProps(componentData, key);

      // 处理子节点
      const childeNode = children.length
        ? children.map((ele) => renderInstance(h, ele))
        : [];

      // 处理枚举
      let enumNode = [];
      enumNode = enums ? processingEnum.bind(this)(h, tag, enums) : [];
      // 处理具名插槽
      const nameSlotsList =
        processingNameSlot.bind(that)(h, nameSlots, conf) || [];
      // 生成节点
      const node = h(tag, componentData, [
        ...nameSlotsList,
        ...childeNode,
        ...enumNode,
      ]);
      return formatter
        ? typeof formatter === "function"
          ? formatter(h, { option: this.item, model: this.formData })
          : h(formatter)
        : node;
    };
    return renderInstance(h, this.item);
  },
  methods: {
    // 全局的Prop处理
    globalProps(componentData, key) {
      if (!Object.keys(this.options).length) {
        return;
      }
      const { props } = componentData;
      const { ignore = [] } = this.options;
      if (ignore.indexOf(key) > -1) {
        return;
      }
      // 如果存在disabled，就优先使用全局的disabled
      // eslint-disable-next-line no-prototype-builtins
      this.options.hasOwnProperty("disabled") &&
        Object.assign(props, {
          disabled: this.options.disabled,
        });
    },
  },
});
