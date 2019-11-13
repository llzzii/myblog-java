export class EditorConfig {
  public width = "100%";
  public height = "90%";
  public path = "assets/editor_md/lib/";
  public codeFold: true;
  public searchReplace = true;
  public toolbar = true;
  public emoji = true;
  public taskList = true;
  public tex = true;
  public readOnly = false;
  public tocm = true;
  public watch = true;
  public previewCodeHighlight = true;
  public saveHTMLToTextarea = true;
  public markdown = "";
  public flowChart = true;
  public syncScrolling = true;
  public sequenceDiagram = true;
  public imageUpload = true;
  public imageFormats = ["jpg", "jpeg", "gif", "png", "bmp", "webp"];
  public imageUploadURL = "";
  autoHeight: true;
  theme: "dark";
  previewTheme: "dark";
  editorTheme: "pastel-on-dark";
  // syncScrolling : false,
  // watch : false,                // 关闭实时预览
  htmlDecode: "style,script,iframe|on*"; // 开启 HTML 标签解析，为了安全性，默认不开启
  // toolbar  : false,             //关闭工具栏
  // previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
  // dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
  // dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
  // dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
  // dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
  // dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
  constructor() {}

  public onload() {}
  public onchange() {}
}
