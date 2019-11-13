import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { $ } from "jquery";

import { EditorConfig } from "../editor-config";

declare var editormd: any;
const UEDITOR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditorToHtmlComponent),
  multi: true,
};

@Component({
  selector: "app-editor-to-html",
  templateUrl: "./editor-to-html.component.html",
  styleUrls: ["./editor-to-html.component.css"],
})
export class EditorToHtmlComponent implements AfterViewInit, OnDestroy {
  @Input() mdContent: string;

  @ViewChild("host") host;
  testEditormdView;
  private mdeditor: any;
  private value: string;
  constructor(private ngZone: NgZone) {}

  ngOnDestroy(): void {
    this.destroy();
  }
  writeValue(value: string): void {
    this.value = value;
    console.log("value", value);
    if (this.mdeditor) {
      this.mdeditor.setMarkdown(this.value);
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.mdeditor.setDisabled();
    } else {
      this.mdeditor.setEnabled();
    }
  }

  init() {
    if (typeof editormd === "undefined") {
      console.error("UEditor is missing");
      return;
    }

    this.testEditormdView = editormd.markdownToHTML("test-editormd-view", {
      markdown: this.mdContent, // + "\r\n" + $("#append-test").text(),
      // htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
      htmlDecode: "style,script,iframe", // you can filter tags decode
      // toc             : false,
      tocm: true, // Using [TOCM]
      tocContainer: "#toHtml", // 自定义 ToC 容器层
      // gfm             : false,
      // tocDropdown     : true,
      // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
      emoji: true,
      taskList: true,
      tex: true, // 默认不解析
      flowChart: true, // 默认不解析
      sequenceDiagram: true, // 默认不解析
    });
  }

  destroy() {
    if (this.mdeditor) {
      //   this.mdeditor.removeListener("ready");
      //   this.mdeditor.removeListener("contentChange");
      //   this.mdeditor.editor.remove();
      //   this.mdeditor.destroy();
      this.mdeditor = null;
    }
  }

  getMarkContent() {
    return this.mdeditor.getMarkdown();
  }

  getHtmlContent() {
    console.log("this.mdeditor.getHTML() 1", this.mdeditor.getHTML());
    return this.mdeditor.getHTML();
  }
  ngAfterViewInit(): void {
    this.init();
  }
}
