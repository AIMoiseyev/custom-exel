import { ExcelComponent } from "@core/ExcelComponent";
import { $ } from "@core/dom";
import { createTable } from "@/components/table/table.template";
import { resizeHandler } from "@/components/table/table.resize";
import {
  shouldResize,
  isCell,
  matrix,
  nextSelection,
} from "@/components/table/table.functions";
import { TableSelection } from "@/components/table/TableSelection";
import * as actions from "@/redux/actions";
import { defaultStyles } from "@/constants";
import { parse } from "@core/parse";

export class Table extends ExcelComponent {
  static className = "excel__table";
  constructor($root, options) {
    super($root, {
      name: "Table",
      listeners: [
        // "click",
        "mousedown",
        "keydown",
        "input",
        // "mousemove",
        //  "mouseup"
      ],
      ...options,
    });
  }

  toHTML() {
    return createTable(20, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);

    this.$on("formula:input", (text) => {
      this.selection.current.attr("data-value", text).text(parse(text));
      this.updateTextInStore(text);
    });

    this.$on("formula:done", () => {
      this.selection.current.focus();
    });
    this.$on("toolbar:applyStyle", (style) => {
      this.selection.applyStyle(style);
      this.$dispatch(
        actions.applyStyle({
          value: style,
          ids: this.selection.selectedIds,
        })
      );
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit("table:select", $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
    } catch (err) {
      console.warn("Resize error", err.message);
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        // const target = $target.id(true);
        // const current = this.selection.current.id(true);

        const $cells = matrix($target, this.selection.current).map((id) =>
          this.$root.find(`[data-id="${id}"]`)
        );
        this.selection.selectGroup($cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      "Enter",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    const { key } = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();

      const id = this.selection.current.id(true);

      const $next = this.$root.find(nextSelection(key, id));
      this.selectCell($next);
    }
  }

  updateTextInStore(value) {
    this.$dispatch(
      actions.changeText({
        id: this.selection.current.id(),
        value,
      })
    );
  }

  onInput(event) {
    // this.$emit("table:input", $(event.target));
    const text = $(event.target).text();
    this.updateTextInStore(text);
  }
}
