<template>
  <form-item
    ref="formItem"
    :scheam="scheam"
    :formData="formData"
    :injectComponent="injectComponent"
    :options="options"
  >
  </form-item>
</template>
<script>
import TreeDemo from "./tree.vue";
import SelectDemo from "./select.vue";
import formItem from "../form-render/form-item.vue";
export default {
  components: {
    formItem,
  },
  data() {
    return {
      options: {
        beverages: "cola",
      },
      formData: {
        name: "",
      },
      injectComponent: [
        {
          formatter: () => <TreeDemo></TreeDemo>,
        },
        {
          formatter: () => <SelectDemo></SelectDemo>,
        },
      ],
      scheam: [
        {
          formItem: {
            formatterOn: `{{(h) => h('div', {class: 'mt10'}, ['自定义组件'])}}`,
            expressionKeyList: ["formatterOn"],
          },
        },
        {
          customComponentIndex: 0,
        },
        {
          formItem: {
            span: 6,
            props: {
              prop: "name",
              label: "",
              labelWidth: "80px",
            },
            visible: true,
            nameSlots: {
              label: {
                customComponentIndex: 1,
              },
            },
          },
          children: [
            {
              on: {},
              key: "name",
              tag: "ElInput",
              props: {
                size: "",
                disabled: false,
                readonly: false,
                type: "text",
                autosize: false,
                suffixIcon: "",
                prefixIcon: "",
                clearable: false,
                placeholder: "",
                value: "",
              },
              option: {
                componentDataKey: "value",
                value: "",
                type: "string",
                formDataKey: "name",
                tag: "ElInput",
              },
            },
          ],
        },
      ],
    };
  },
};
</script>
<style>
.el-tree {
  top: 21px;
}
.el-col-6 {
  margin-top: 30px;
}
</style>
