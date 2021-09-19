import { ExcelStateComponent } from "@core/ExcelStateComponent";
import { createToolbar } from "@/components/toolbar/toolbar.template";
import { defaultStyles } from "@/constants";
import { $ } from "@core/dom";
export class Toolbar extends ExcelStateComponent {
  static className = "excel__toolbar";

  constructor($root, options) {
    super($root, {
      name: "Toolbar",
      listeners: ["click"],
      subscribe: ["currentStyles"],
      ...options,
    });
  }

  prepare() {
    this.initState(defaultStyles);
  }

  get template() {
    console.log("render");
    return createToolbar(this.state);
  }

  toHTML() {
    return this.template;
  }

  storeChanged(changes) {
    this.setState(changes.currentStyles);
  }

  onClick(event) {
    const $target = $(event.target);
    if ($target.data.type === "button") {
      const value = JSON.parse($target.data.value);
      this.$emit("toolbar:applyStyle", value);

      // const key = Object.keys(value)[0];
      // this.setState({ [key]: value[key] });
    }
  }
}
