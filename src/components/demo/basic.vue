<template>
  <form-item
    ref="formItem"
    :scheam="scheam"
    :formData="formData"
    :formProperty="formProperty"
  ></form-item>
</template>
<script>
import formItem from "../form-render/form-item.vue";
export default {
  components: {
    formItem,
  },
  data() {
    return {
      formData: {
        name: "1",
        password: 1,
        type: false,
        mark: "",
        date: "",
        status: true,
      },
      scheam: [
        {
          formItem: {
            formatter: (h) =>
              h("div", { class: "mt10" }, ["\u5206\u9694\u680F"]),
          },
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "输入框",
              labelWidth: "64px",
              prop: "name",
            },
            visible: true,
          },
          children: [
            {
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
              on: {},
              key: "name",
              tag: "ElInput",
              expressionKeyList: [],
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "数字输入框",
              labelWidth: "64px",
              prop: "password",
            },
            visible: true,
          },
          children: [
            {
              props: {
                step: 2,
                max: Infinity,
                min: -Infinity,
                disabled: false,
                size: "",
                precision: undefined,
                placeholder: "",
                value: 1,
              },
              option: {
                componentDataKey: "value",
                value: 1,
                type: "number",
                formDataKey: "password",
                tag: "ElInputNumber",
              },
              on: {},
              key: "password",
              tag: "ElInputNumber",
              expressionKeyList: [],
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "多选框",
              labelWidth: "64px",
              prop: "type",
            },
            visible: true,
          },
          children: [
            {
              props: {
                label: undefined,
                indeterminate: false,
                disabled: false,
                checked: false,
                trueLabel: "",
                falseLabel: "",
                border: false,
                size: "",
                value: true,
              },
              option: {
                componentDataKey: "value",
                value: true,
                type: "boolean",
                formDataKey: "type",
                tag: "ElCheckbox",
              },
              on: {},
              key: "type",
              tag: "ElCheckbox",
              expressionKeyList: [],
            },
          ],
        },
        { formItem: { isTagComponent: true, visible: true } },
        {
          formItem: {
            span: 6,
            props: {
              label: "输入框",
              labelWidth: "64px",
              prop: "mark",
            },
            visible: true,
          },
          children: [
            {
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
                formDataKey: "mark",
                tag: "ElInput",
              },
              on: {},
              key: "mark",
              tag: "ElInput",
              expressionKeyList: [],
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "日期选择器",
              labelWidth: "64px",
              prop: "date",
            },
            visible: true,
          },
          children: [
            {
              props: {
                size: "",
                format: "",
                valueFormat: "",
                readonly: false,
                placeholder: "",
                startPlaceholder: "",
                endPlaceholder: "",
                prefixIcon: "",
                clearIcon: "el-icon-circle-close",
                disabled: false,
                clearable: true,
                popperClass: "",
                editable: true,
                align: "left",
                defaultValue: undefined,
                rangeSeparator: "-",
                pickerOptions: undefined,
                type: "date",
                value: "",
              },
              option: {
                componentDataKey: "value",
                value: "",
                type: "string",
                formDataKey: "date",
                tag: "ElDatePicker",
              },
              on: {},
              key: "date",
              tag: "ElDatePicker",
              expressionKeyList: [],
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "开关",
              labelWidth: "64px",
              prop: "status",
            },
            visible: true,
          },
          children: [
            {
              props: {
                disabled: false,
                activeText: "",
                inactiveText: "",
                activeColor: "",
                inactiveColor: "",
                activeValue: true,
                inactiveValue: false,
                value: true,
              },
              option: {
                componentDataKey: "value",
                value: true,
                type: "boolean",
                formDataKey: "status",
                tag: "ElSwitch",
              },
              on: {},
              key: "status",
              tag: "ElSwitch",
              expressionKeyList: [],
            },
          ],
        },
      ],
      formProperty: {
        rules: {},
        labelPosition: "left",
        labelWidth: "64px",
        hideRequiredAsterisk: false,
        inline: false,
        disabled: false,
        showMessage: true,
      },
    };
  },
};
</script>
<style lang=""></style>
