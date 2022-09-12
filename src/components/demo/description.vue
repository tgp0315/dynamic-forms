<template>
  <form-item ref="formItem" :scheam="scheam" :formData="formData">
    <div slot="footer">
      <el-button>保存</el-button>
      <el-button>重置</el-button>
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
        name: "11",
      },
      scheam: [
        {
          formItem: {
            span: 6,
            props: {
              label: "输入框",
              labelWidth: "64px",
              prop: "name",
            },
            visible: true,
            description: {
              props: {
                // el-popover参数
                content: "一个简单的提示语",
                trigger: "hover", // 气泡显示方式
                placement: "top-start",
                width: 200, // 提示语内容容器宽度
              },
            },
            nameSlots: {
              // 当value为string时
              label: {
                value: "自定义的",
                on: {
                  click: () => {
                    console.log("触发了点击事件");
                  },
                },
                style: {
                  color: "red",
                  cursor: "pointer",
                  width: "80px",
                },
                className: "label-class",
                // customComponentIndex: 0 // 当使用自定义注入组件时，使用customComponentIndex指定自定义注入组件的索引
                // value: () => <div>实验一下</div> // 当value 为function时，仅渲染function内部的数据，数据可为组件 dom节点   string
              },
            },
          },
          children: [
            {
              props: {
                size: "",
                disabled: false,
                readonly: false,
                autosize: false,
                type: "text",
                suffixIcon: "",
                prefixIcon: "",
                clearable: false,
                placeholder: "",
                value: "11",
              },
              option: {
                componentDataKey: "value",
                value: "11",
                type: "string",
                formDataKey: "name",
                tag: "ElInput",
              },
              on: {
                blur: function () {
                  this.validateField("name"); // 父级提供的依赖注入方法
                  console.log("失焦事件");
                },
                change() {
                  console.log("数据变化了");
                },
                input() {
                  console.log("输入事件");
                },
              },
              key: "name",
              tag: "ElInput",
              expressionKeyList: [],
            },
          ],
        },
        {
          formItem: {
            formatter: () => (
              // 渲染自定义组件
              <div class="block">
                <span class="demonstration">默认</span>
                <el-slider value={this.value1}></el-slider>
              </div>
            ),
            visible: true,
          },
        },
      ],
      value1: 30,
    };
  },
};
</script>
<style lang=""></style>
