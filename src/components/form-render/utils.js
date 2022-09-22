import { isEqual } from "lodash";
import { isVNode } from "element-ui/src/utils/vdom";

export const expressionSuffix = "On";

/**
 *
 * @description 判断js的类型 字符串、number、Boolean、array、function、object、null、undefined、VNode
 * @export
 * @param {*} v
 * @return {*}
 */
export function parseTypeValue(v) {
  // 获取 vnode 实例
  const t = Object.prototype.toString.call(v);
  let res = "";
  if (t.match(/\[object (.*?)\]/)) {
    res = RegExp.$1;
  }
  res = res.toLocaleLowerCase();
  if (res === "object") {
    // // 获取 vnode 实例
    // let vnode = new Vue().$createElement('span', '')

    // // VNode 构造函数
    // let VNode = vnode.constructor

    // // 所以通过 obj instanceof VNode 即可判断
    // const isVNode = obj => obj instanceof VNode
    res = isVNode(v) ? "VNode" : res;
    // vnode = null
  }

  return res;
}
/**
 *
 * @des 具名插槽处理
 * @export
 * @param {*} createElement vue.createElement
 * @param {*} [obj={}] 插槽对象
 * @param {*} conf 当前配置
 * @return {*}
 */
export function processingNameSlot(createElement, source = {}, conf) {
  let target = [];
  if (!Object.keys(source).length) {
    return target;
  }
  for (const [slotName, res] of Object.entries(source)) {
    const {
      value,
      on = {},
      className = {},
      style = {},
      customComponentSub = -1,
    } = res || {};
    const eventsMap = bindEvent.bind(this)(on);

    if (typeof value === "function") {
      const v = value.bind(this)(createElement, conf);
      const instance = createElement("div", { slot: slotName }, [v]);
      target.push(instance);
    } else if (typeof value === "string") {
      const instance = createElement("div", {
        slot: slotName,
        domProps: { innerHTML: value },
        on: eventsMap,
        class: className,
        style,
      });
      target.push(instance);
    } else if (customComponentSub > -1) {
      const { formatter } = this.injectComponent[customComponentSub];
      const instance = createElement(
        "div",
        {
          slot: slotName,
          on: eventsMap,
          class: className,
          style,
        },
        [
          formatter(createElement, {
            option: this.item,
            model: this.context.formData,
          }),
        ]
      );
      target.push(instance);
    }
  }
  return target;
}

/**
 *
 * @des 事件遍历绑定指针
 * @export
 * @param {*} events
 * @return {*}
 */
export function bindEvent(events) {
  let res = {};
  if (Object.prototype.toString.call(events) !== "[object Object]") {
    return res;
  }
  for (const [key, fn] of Object.entries(events)) {
    if (parseTypeValue(fn) === "function") {
      res[key] = fn.bind(this);
    }
  }
  return res;
}

// 内置的option
const enumMap = {
  ElSelect: "el-option",
  "el-select": "el-option",
  "el-radio-group": "el-radio",
  "el-checkbox-group": "el-checkbox",
  ElCheckboxGroup: "el-checkbox",
  ElRadioGroup: "el-radio",
};
/**
 *
 * @description 处理数据字典
 * @export
 * @param {*} h
 * @param {*} tag
 * @param {*} val
 * @return {*}
 */
export function processingEnum(h, tag, val) {
  let data = [];
  if (
    ["[object Object]", "[object String]", "[object Array]"].indexOf(
      Object.prototype.toString.call(val)
    ) === -1
  ) {
    return data;
  }
  if (typeof val === "string") {
    data = [];
    data = data.map((ele) => {
      return {
        label: ele.lookupValue,
        value: ele.lookupCode,
      };
    });
  } else if (Object.prototype.toString.call(val) === "[object Object]") {
    const { code = "", keyMap = {} } = val;
    if (!code) {
      return [];
    }
    data = [];
    data = data.map((ele) => {
      return {
        label: ele[keyMap["label"] || "lookupValue"],
        value: ele[keyMap["value"] || "lookupCode"],
      };
    });
  } else {
    // 如果是数组
    data = val;
  }
  const option = enumMap[tag];
  const optionNode = option
    ? data.map((props) => {
        return h(
          option,
          {
            props,
          },
          props["label"]
        );
      })
    : [];
  return optionNode;
}

export /**
 *
 * 获取 obj|array中的某个key的值。并返回最后的key与对象，方便操作数据
 * @param {*} key
 * @param {*} obj
 * @return {*}
 */
const getValue = (key, obj) => {
  if (!key) {
    return "";
  }
  // 'a.b[0].c' or 'a.b[0].c[0]'
  if (key.indexOf(".") > 0) {
    let arr = key.split(".");
    let length = arr.length - 1;
    return arr.reduce((s, k, i) => {
      let index = k.indexOf("[");
      if (i === length) {
        if (index > 0) {
          return {
            value: (s[k.substr(0, index)] || [])[
              +k.substring(index + 1, k.length - 1)
            ],
            obj: s,
            lastKey: k,
          };
        }
        return {
          value: s[k],
          obj: s,
          lastKey: k,
        };
      } else {
        if (index > 0) {
          return (
            (s[k.substr(0, index)] || [])[
              +k.substring(index + 1, k.length - 1)
            ] || {}
          );
        }
        return s[k] || {};
      }
    }, obj);
  }
  // 'a[0]'
  let index = key.indexOf("[");
  if (index > 0) {
    return {
      value: (obj[key.substr(0, index)] || [])[
        +key.substring(index + 1, key.length - 1)
      ],
      obj: obj,
      lastKey: key,
    };
  }
  return {
    value: obj[key],
    obj,
    lastKey: key,
  };
};

/**
 *
 * @description 表达式处理
 * @export
 * @param {*} [item={}]
 * @param {*} [expressionMap={}]
 */
export function parseExpressions(item = {}, expressionMap = {}) {
  // 如果不存在表达式路径就返回
  const { option, expressionKeyList = [] } = item || {};
  if (!expressionKeyList.length) {
    return;
  }
  // 组件的数据key 与 绑定数据的propskey
  const { formDataKey, componentDataKey } = option || {};

  for (let i = 0; i < expressionKeyList.length; i++) {
    // 此时的表达式key是全路径的，目的是为了方便找到具体的父级对象，让通过set去修改
    const k = expressionKeyList[i];
    // 找到 表达式的值 实际的key 包裹的对象
    let { value, obj, lastKey } = getValue(k, item);
    // 拿到实际key
    const key = lastKey.replace(expressionSuffix, "");
    // 拿到实际值
    let { value: v } = getValue(k.replace(expressionSuffix, ""), item);
    // 查看是否存在本地表达式
    const expression = expressionMap[k] || {};
    // text为存储在本地的表达式的值 fn为实际的值
    const { text, fn } = expression || {};

    const isEqualLocal = isEqual(value, text);
    // 如果存在本地的表达式 则判断实际值 fn 是不是function类型并且是bind过的function，如果是则不通过则说明是新增的。
    if (
      fn &&
      parseTypeValue(fn) === "function" &&
      fn.name === "bound anonymous"
    ) {
      // 如果实际值是function则删除本地表达式，这个时候会重新触发render。重走逻辑
      // 判断实际值是否为function
      if (parseTypeValue(v) !== "function") {
        // 对比本地的表达式的值是否相等，
        if (isEqualLocal) {
          // 相等则解析
          let exprssionValue = fn.bind(this)();
          if (
            parseTypeValue(exprssionValue) === "object" &&
            // eslint-disable-next-line no-prototype-builtins
            exprssionValue.hasOwnProperty(key)
          ) {
            exprssionValue = exprssionValue[key];
          }
          // 如果解析出来的表达式的值与之前一致则跳过
          if (isEqual(v, exprssionValue)) {
            continue;
          }
          // 反之设置
          this.$set(
            obj,
            key,
            parseTypeValue(exprssionValue) === "function"
              ? exprssionValue.bind(this)
              : exprssionValue
          );
          // 如果是 数据的key 则设置对应的值到formData中去
          if (
            key === componentDataKey &&
            typeof this.setFormData === "function"
          ) {
            this.setFormData(formDataKey, exprssionValue);
          }
          continue;
        } else {
          // 更新本地的表达式并判断是否合法，不合法则跳过
          const isPass = setExpression.bind(this)(
            value,
            text,
            obj,
            key,
            lastKey,
            i,
            k,
            expressionMap,
            expressionKeyList
          );
          if (!isPass) {
            continue;
          }
        }
      } else {
        // 如果是function且修改了，则删除表达式，重新走一次，修正最后的表达式
        if (!isEqualLocal) {
          delete expressionMap[k];
        }
      }
    }

    // 解析表达式
    if (!text && parseTypeValue(value) === "string") {
      const isPass = setExpression.bind(this)(
        value,
        text,
        obj,
        key,
        lastKey,
        i,
        k,
        expressionMap,
        expressionKeyList
      );
      if (!isPass) {
        continue;
      }
    }
  }
}

/*
 * 存储表达式的值 以k的形式
 */
function setExpression(
  value,
  text,
  obj,
  key,
  lastKey,
  i,
  k,
  expressionMap,
  expressionKeyList
) {
  // 凡是字符串且用 {{}}包裹的都是表达式
  const reg = /\{\{(.*)\}\}/;
  const { option } = this.item;
  const { formDataKey, componentDataKey } = option || {};
  if (value.match(reg)) {
    try {
      let v = RegExp.$1;
      // 绑定作用域
      // eslint-disable-next-line no-new-func
      const parseFun = new Function(`return ${v}`).bind(this);

      let parseValue = parseFun();
      // 判断是否为对象，且是否等于对应的key，是则取值
      if (
        parseTypeValue(parseValue) === "object" &&
        // eslint-disable-next-line no-prototype-builtins
        parseValue.hasOwnProperty(key)
      ) {
        parseValue = parseValue[key];
      }
      // 如果实际结果，相等则跳过
      if (isEqual(value, text)) {
        return false;
      }
      // 再次判断是否为function 是就绑定作用域
      parseValue =
        parseTypeValue(parseValue) === "function"
          ? parseValue.bind(this)
          : parseValue;
      // 设置实际的值
      this.$set(obj, key, parseValue);

      // 如果表达式等于组件绑定的key,则更新数据
      if (key === componentDataKey && typeof this.setFormData === "function") {
        this.setFormData(formDataKey, parseValue);
      }
      // 存入到本地
      this.$set(expressionMap, k, {
        fn: parseFun,
        text: value,
      });
      return false;
    } catch (error) {
      this.$message.error("表达式错误！！请检查！！");
      // 不合法则本地的删除表达式
      // delete obj[key]
      delete obj[lastKey];
      // 并且删除对应的表达式
      // 这里是否有BUG，i可能对不上？不会，这里是一维数组
      expressionKeyList.splice(i, 1);
    }
  }
}
