# dynamic-forms

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```
### 组件简介
```
scheam 为约定的json列表，必选是array类型，主要用来渲染el-form-item及其子项，其中分为formItem和children类型
格式为：
scheam: [
  {
    formItem: {},
    children: []
  }
]

scheam 中的formItem的数据格式为object或者function,目的是用来渲染el-form表单的el-form-item组件并作为其插槽的包装组件或者占位组件，例如：

scheam: [
  {
    formItem: {
      span: 6,
      props: { // 对应 el-form-item 参数
        label: '输入框',
        prop: name,
        rules: this.$rule.str('请输入', true)
      },
      visible: true, // 是否渲染当前的 el-form-item
      description: {}, //当你需要在表单的label后面添加提示时的组件  通过包装 el-popover来显示提示语
      on: {}, // el-form-item的事件， 事件可行时触发
      className: {}, // el-form-item添加class类名
      style: {}, // el-form-item 添加style样式
      nameSlots: {}, // el-form-item 添加具名插槽，需要自定义label时
      isTagComponent: false // 是否为占位组件
    },
    children: []
  }
]

cheam 中的children的数据格式为array,目的是用来渲染el-form-item表单的子组件，children每一项必须是object，例如：
scheam: [
  {
    formItem: {},
    children: [
      {
        tag: 'el-input', // 需要渲染的组件的name
        key: 'name', // 当前组件需要渲染的数据
        option: { //  当前渲染的组件的数据信息， 当需要绑定formaData时必填
          componentDataKey: 'value', // 渲染表单数据的props的值，例如el-input为value, el-tree为data
          value: '11', // 当前渲染组件的默认值， 在编辑器中会使用到
          type: 'string', // 数据的类型，数据校验做扩展功能提供校验支撑
          formDataKey: 'name', // 绑定表单数据formData的key值
          tag: 'el-input'
        },
        props: { // el-input组件的props
          size: '',
          disabled: false,
          readonly: false,
          autosize: false,
          type: 'text',
          suffixIcon: '',
          prefixIcon: '',
          clearable: false,
          placeholder: '',
          value: '11'
        },
        on: {  // 为组件添加自定义事件时，在on中添加事件， on中的事件不能是箭头函数，因为内部锁定了作用域，若需要拿到父级的实例，内部也提供了常见的父级实例的方法与属性
          blur: function() {
            console.log('失焦事件')
          },
          change() {
            console.log('数据变化了')
          },
          input() {
            console.log('输入事件')
          }
        },
        style: {}, // 当前钻进添加样式
        id: {}, // 为当前钻进添加id, 操作dom使用，保证唯一性
        className: 'custom', // 为组件添加样式
        ref: 'elInput', // 绑定ref
        nameSlots: { // 添加具名插槽
          suffix: {
            value: '' // 可以是 string dom function
          }
        },
        enums: [
          {
            label: '北京',
            value: '1'
          },
          {
            label: '河北',
            value: '2'
          }
        ], // 当组件为选择器(即select)时使用，可为  string  object   array
        expressionKeyList: ['On:blur'], // 需要进行联动时
      }
    ]
  }
]

children 中的formatter, 当你想渲染自定义组件时，可以使用formatter方法渲染

scheam: [
  {
    formItem: {},
    children: [
      {
        formatter: () => (<custom></custom>)
      }
    ]
  }
]

formProperty  为  el-form的props属性，这里可以一些全局的属性，详见element-ui文档

formProperty: {
  rules: {},
  labelPosition: "left",
  labelWidth: "64px",
  hideRequiredAsterisk: false,
  inline: false,
  disabled: false,
  showMessage: true,
}

```
### 表单联动
```
当表单中的某一项需要与另一项联动，我们需要使用{{}}来包装你需要联动的key的表达式,同时通过expressionKeyList告诉我们哪些key是需要动态改变的，需要注意的是所有的表达式关联的key都是需要添加后缀On，并且需要填加key的路径，比如添加children下props中的placeholder，则是props.placeholderOn,我们本地文件中可以使用formatter形式自定义组件，但当我们需要把数据转为json存储在后端时，则需要转换成表达式或者注入自定义事件
```
### 注入自定义组件
```
我们的渲染器底层使用的是Vue的render函数去渲染的，绝大多数情况下渲染的都是全局组件，但是全局组件不能满足现有业务的情况下,我们提供了注入自定义组件的入口，即injectComponent属性，此属性接收需要使用的自定义组件，使用时，我们需要customComponentSub参数告知我们自定义组件所需的参数以及注入位置
```

### 参数说明
| 属性 | 说明 | 类型 |
| ------ | ------ | ------ |
| formData | 必选，form表单数据 | object |
| scheam | 必选，描述表单的基本信息、结构和检验 | array |
| formProperty | 表单的属性（el-form） | object |
| injectComponent | 注入自定义组件 | array |
