<template>
  <form-item ref="formItem" :scheam="scheam" :formData="formData">
    <div slot="footer">
      <el-button @click="save">保存</el-button>
      <el-button @click="cancle">取消</el-button>
    </div>
  </form-item>
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
        name: "",
        sex: "",
        boy: "",
        girl: "",
      },
      scheam: [
        {
          formItem: {
            formatterOn: `{{(h) => h('div', { class: 'mt10' }, ['动态表单'])}}`,
            expressionKeyList: ["formatterOn"],
          },
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "姓名：",
              prop: "name",
              // rules: this.$rule.str('请填写姓名', true, 'change')
            },
          },
          children: [
            {
              tag: "ElInput",
              key: "name",
              option: {
                formDataKey: "name",
                componentDataKey: "value",
                tag: "ElInput",
                value: "",
                type: "string",
              },
              props: {
                clearable: true,
              },
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "性别：",
              prop: "sex",
              // rules: this.$rule.str('请选择性别', true, 'change')
            },
          },
          children: [
            {
              tag: "ElSelect",
              key: "sex",
              option: {
                formDataKey: "sex",
                componentDataKey: "value",
                tag: "ElSelect",
                value: "",
                type: "string",
              },
              props: {
                clearable: true,
                placeholderOn: `{{this.formData.name}}`,
              },
              enums: [
                {
                  label: "男",
                  value: "1",
                },
                {
                  label: "女",
                  value: "2",
                },
              ],
              expressionKeyList: ["props.placeholderOn"],
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "男生爱好：",
              prop: "body",
              // rules: this.$rule.str('请选择爱好', true, 'change')
            },
            visibleOn: `{{this.formData.sex === '1'}}`,
            expressionKeyList: ["visibleOn"],
          },
          children: [
            {
              tag: "ElSelect",
              key: "boy",
              option: {
                formDataKey: "boy",
                componentDataKey: "value",
                tag: "ElSelect",
                value: "",
                type: "string",
              },
              props: {
                clearable: true,
                placeholder: "请选择",
                value: "",
              },
              enums: [
                {
                  label: "健身",
                  value: "1",
                },
                {
                  label: "游泳",
                  value: "2",
                },
              ],
              expressionKeyList: [],
            },
          ],
        },
        {
          formItem: {
            span: 6,
            props: {
              label: "女生爱好：",
              prop: "girl",
              // rules: this.$rule.str('请选择爱好', true, 'change')
            },
            visibleOn: `{{this.formData.sex === '2'}}`,
            expressionKeyList: ["visibleOn"],
          },
          children: [
            {
              tag: "ElSelect",
              key: "girl",
              option: {
                formDataKey: "girl",
                componentDataKey: "value",
                tag: "ElSelect",
                value: "",
                type: "string",
              },
              props: {
                clearable: true,
                placeholder: "请选择",
                value: "",
              },
              enums: [
                {
                  label: "拍照",
                  value: "1",
                },
                {
                  label: "消费",
                  value: "2",
                },
              ],
              on: {
                changeOn: `{{function (val) {const {label} = this.item.enums.find(ele => ele.value === val); this.$message.success(label)}}}`,
              },
              expressionKeyList: ["on:changeOn"],
            },
          ],
        },
      ],
    };
  },
  methods: {
    save() {
      this.$$refs.formItem.submitForm().then((valid) => {
        if (valid) this.$message.success("通过");
      });
    },
    cancle() {
      this.$refs.formItem.resetForm();
    },
  },
};
</script>
<style lang=""></style>
