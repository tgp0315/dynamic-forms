import { processingNameSlots, parseExpression, bindEventsMap } from "./utils";
export default {
  inject: ["options", "scheam", "injectComponent", "context"],
  props: {
    item: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    inline: {
      type: Boolean,
    },
    showToolbar: {
      type: Boolean,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    computedRestSpanInRows() {
      // 如果不是占位组件就不走下面
      // if (!this.item.isTagComponents) {
      //   return 0;
      // }
      const excludeKeyList = ["isTagComponents", "customComponentIndex"];
      const list =
        this.scheam
          .slice(0, this.index)
          // eslint-disable-next-line no-prototype-builtins
          .filter((el) => !excludeKeyList.some((v) => el.hasOwnProperty(v))) ||
        [];
      // 如果是分隔栏或者自定义的组件，则存在一个问题，就是需要把前面的都算成24的整数倍， (24*N)%24 = 0 从后面开始算
      let visibleList = list.map((ele) => {
        const isRowSpan =
          !!ele.formItem.formatter ||
          (ele.formItem &&
            ele.formItem.visible &&
            (!ele.formItem.span || ele.formItem.span === 24));
        const noSpan = ele.formItem && !ele.formItem.visible;
        const span = ele.formItem && ele.formItem.span;
        return {
          span: isRowSpan ? 24 : noSpan ? 0 : span,
          isFormatter: !!ele.formItem.formatter,
        };
      });
      const isLastFormatterIndex = visibleList.lastIndexOf(
        (ele) => ele.isFormatter
      );
      // 如果是分隔栏或者其他自定义的组件，那么前面的就统统计算成24的倍数，防止后面计算错误
      if (isLastFormatterIndex > -1) {
        visibleList.forEach((ele, i) => {
          if (i <= isLastFormatterIndex) {
            ele.span = 24;
          }
        });
      }
      const spanList = visibleList.map((ele) => ele.span) || [];
      let span = spanList.length ? spanList.reduce((pre, cur) => pre + cur) : 0;
      span = isNaN(span) ? 0 : span;
      span = +span;
      let resetSpan = span < 24 ? 24 - span : 24 - (span % 24);
      return resetSpan;
    },
  },
  data() {
    return {
      expressionMap: {},
    };
  },
  render(h) {
    // this.parseExpression()
    parseExpression.bind(this)(this.item, this.expressionMap);
    const { layout = {} } = this.options || {};
    let ColClassName = {};
    if (layout.col && layout.col.className) {
      layout.col.className.forEach((c) => {
        ColClassName[c] = !!c;
      });
    }
    // 默认的插槽
    let defaultSlots = this.$slots.default || [];

    const toolbarSlots = this.showToolbar ? this.$slots.toolbarSlots : "";

    const {
      props = {},
      nameSlots = {},
      span = 6,
      className = {},
      on = {},
      description = {},
      visible = true,
      formatter = null,
      style = {},
      isTagComponents = false,
    } = this.item || {};
    if (isTagComponents) {
      this.$set(this.item, "span", this.computedRestSpanInRows);
      this.$set(this.item, "visible", true);
    }
    // 事件处理
    let onMap = bindEventsMap.bind(this)(on) || {};
    // el-col的属性处理
    // const colComponentData = {
    //   props: Object.assign(col.props ? {} : col.props,)
    // }

    // el-label-click class是具有点击事件的时候添加上去的，
    const formItemCompoentData = {
      props,
      class: className,
      style,
      on: {
        ...on,
        ...onMap,
      },
    };
    // el-form-item的具名插槽处理
    const nameSoltsList = processingNameSlots.bind(this)(h, nameSlots);

    // 描述node
    const descriptionNode = this.createDescriptionNode(h, description);
    // form-item
    const content = h(
      "el-form-item",
      {
        ...formItemCompoentData,
      },
      [
        ...nameSoltsList,
        descriptionNode,
        ...defaultSlots,
        this.inline
          ? h("div", { style: { padding: !this.inline ? "" : "8px 0" } })
          : "",
      ]
    );
    return visible
      ? isTagComponents
        ? h(
            "el-col",
            {
              props: {
                span: this.computedRestSpanInRows,
              },
              style: {
                position: "relative",
              },
            },
            [content, toolbarSlots]
          )
        : formatter
        ? h("el-col", { style }, [
            typeof formatter === "function" ? formatter(h) : h(formatter),
            toolbarSlots,
          ])
        : !this.inline
        ? h(
            "el-col",
            {
              props: {
                span,
              },
              style,
              class: ColClassName,
            },
            [content, toolbarSlots]
          )
        : content
      : "";
  },
  methods: {
    createDescriptionNode(h, description = {}) {
      if (!Object.keys(description).length) {
        return "";
      }
      const { reference: ref, props: popProps = {} } = description;
      const { content: c, ...resetPopProps } = popProps;
      const content =
        typeof c === "function"
          ? c.bind(this)(h)
          : typeof c === "object"
          ? h(c)
          : c;
      const reference = ref ? (
        typeof ref === "function" ? (
          ref()
        ) : (
          ref
        )
      ) : (
        <i
          slot="reference"
          class="el-icon-question"
          style="color: #7653d6;font-size:16px"
        ></i>
      );
      const descriptionNode = h("div", { slot: "label" }, [
        h(
          "span",
          {
            directives: [
              {
                name: "popover",
                rawName: "v-popover:formItemPopover",
                value: "",
                arg: "formItemPopover",
                modifiers: undefined,
              },
            ],
          },
          [reference]
        ),
        h(
          "el-popover",
          {
            props: { ...resetPopProps },
            ref: "formItemPopover",
          },
          [content]
        ),
      ]);
      return descriptionNode;
    },
  },
};
