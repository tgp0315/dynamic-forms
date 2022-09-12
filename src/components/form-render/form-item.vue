<template>
  <div class="form-render">
    <slot name="header"></slot>
    <el-row>
      <el-form v-bind="formProperty" :model="formData" ref="FormRender">
        <template v-for="(item, index) in scheam">
          <form-item
            v-if="item.formItem"
            ref="formItem"
            :inline="inline"
            :key="index"
            :index="index"
            :item="item.formItem"
            :form-data="formData"
          >
            <render-item
              v-for="ele in item.children"
              :key="ele.key"
              :item="ele"
              :form-data="formData"
            ></render-item>
          </form-item>
          <formatter
            v-else-if="injectComponent[item.customComponentIndex]"
            :formatter="injectComponent[item.customComponentIndex].formatter"
            :option="item"
            :model="formData"
            :key="index + 1"
          />
        </template>
      </el-form>
    </el-row>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import Form from "element-ui/lib/form";
import renderItem from "./render-item.js";
import formItem from "./form-item.js";
// import { getValue } from './utils'
import Formatter from "./formatter.js";

export default {
  components: {
    renderItem,
    formItem,
    Formatter,
  },
  name: "FormRender",
  props: Object.assign({}, Form.props, {
    formProperty: {
      type: Object,
      default: () => ({}),
    },
    injectComponent: {
      type: Array,
      default: () => [],
    },
    scheam: {
      type: Array,
      default: () => [],
      required: true,
    },
    formData: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  }),
  provide() {
    return {
      // 全局属性的提供
      options: this.options,
      validateField: this.validateField,
      clearValidate: this.clearValidate,
      resetForm: this.resetForm,
      formData: this.formData,
      setFormData: this.setFormData,
      context: this,
      scheam: this.scheam,
      injectComponent: this.injectComponent || [],
    };
  },
  methods: {
    /*
      手动设置formData的值
    */
    // setFormData(key, value) {
    //   if (key) {
    //     const { lastKey, obj } = getValue(key, this.formData)
    //     this.$set(obj, lastKey, value)
    //   }
    // },
    /*
      删除formData中某个key，在修改key的时候有用
    */
    deletSomeFormDataKey(key) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.formData.hasOwnProperty(key)) {
        delete this.formData[key];
      }
    },
    /*
      修改整个formData
    */
    updateFormData(newFormData) {
      if (!newFormData || !Object.keys(newFormData).length) {
        return;
      }
      // this.formData = newFormData
      for (const [key, value] of Object.entries(newFormData)) {
        this.$set(this.formData, key, value);
      }
    },
    getFormData() {
      return this.formData;
    },
    /*
      获取某个FormData的值
    */
    getFormDataKeyValue(key) {
      return this.formData[key];
    },
    submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs["FormRender"]
          .validate((valid) => {
            resolve(valid);
          })
          .catch((_) => {
            reject(_);
          });
      });
    },
    validateField(key) {
      this.$refs["FormRender"].validateField(key);
    },
    clearValidate(key) {
      this.$refs["FormRender"].clearValidate(key);
    },
    resetForm() {
      this.$refs["FormRender"].resetFields();
    },
  },
};
</script>

<style lang="less"></style>
