import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  forwardRef
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { distanceInWords } from "date-fns";
import { NzI18nService, zh_CN } from "ng-zorro-antd";

import { WebSocketService } from "../../common/web-socket.service";
import { ResponseData } from "../../entity";
import { HomeService } from "../home.service";

declare var editormd: any;
const UEDITOR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DetailComponent),
  multi: true
};

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.css"]
})
export class DetailComponent implements OnInit {
  @ViewChild("header") headerCom;
  @ViewChild("tpl") tplRef: TemplateRef<any>;
  @ViewChild("host") host;
  commentData: any[] = [];
  submitting = false;
  blogId = "";
  blogData: any = {};
  user = {
    author: "游客",
    avatar: "../../../assets/user/nan.jpg",
    userName: ""
  };
  inputValue = "";
  otherComent = false;
  replayValue = "";
  childComent;

  testEditormdView;
  private mdeditor: any;
  private value: string;
  constructor(
    private i18n: NzI18nService,
    private homeService: HomeService,
    private activedRoute: ActivatedRoute,
    private vcRef: ViewContainerRef,
    private websocketService: WebSocketService
  ) {}

  handleSubmit(): void {
    let isLogin = sessionStorage.getItem("isLogin");
    if (isLogin == null || isLogin === "") {
      this.headerCom.login();
      return;
    }
    this.submitting = true;
    const content = this.inputValue;
    this.inputValue = "";
    let that = this;
    let data = {};
    data["blogId"] = this.blogId;
    data["commentContent"] = content;
    data["parentCommentId"] = "0";
    data["commentLikeCount"] = 0;
    this.addComment(data);
  }

  getComment() {
    this.homeService
      .getComment(this.blogId)
      .subscribe((datas: ResponseData) => {
        if (datas.isok) {
          this.commentData = datas.data.map((e, i, a) => {
            return {
              ...e,
              displayTime: distanceInWords(new Date(), e.commentCreatedTime),
              ishow: false,
              index: i
            };
          });
        }
      });
  }
  initEditorMd() {
    if (typeof editormd === "undefined") {
      console.error("UEditor is missing");
      return;
    }
    let that = this;
    this.testEditormdView = editormd.markdownToHTML("editormd-view", {
      markdown: that.blogData.blog.blogContent, // + "\r\n" + $("#append-test").text(),
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
      sequenceDiagram: true // 默认不解析
    });
  }
  addComment(data) {
    this.submitting = false;
    this.homeService.addComent(data).subscribe((datas: ResponseData) => {
      if (datas.isok) {
        this.submitting = true;
        this.getComment();
      }
    });
  }
  changeLanguage(): void {
    this.i18n.setLocale(zh_CN);
  }
  getUserDetail() {
    this.homeService.getUser().subscribe((datas: ResponseData) => {
      if (datas.isok) {
        this.user.author =
          datas.data.userNickname === ""
            ? datas.data.userName
            : datas.data.userNickname;
        this.user.avatar =
          datas.data.userImgurl === ""
            ? "../../../assets/user/nan.jpg"
            : datas.data.userImgurl;
        this.user.userName = datas.data.userName;
      }
    });
  }
  getBlogDetail() {
    this.homeService
      .getBlogDetail(this.blogId)
      .subscribe((datas: ResponseData) => {
        if (datas.isok) {
          this.blogData = datas.data;
          this.initEditorMd();
        }
      });
  }
  like(comment_id, isLike) {
    let isLogin = sessionStorage.getItem("isLogin");
    if (isLogin == null || isLogin === "") {
      this.headerCom.login();
      return;
    }
    let data = {};
    data["commentId"] = comment_id;
    if (isLike) {
      this.homeService
        .deleteLike(comment_id)
        .subscribe((datas: ResponseData) => {
          if (datas.isok) {
            this.getComment();
          }
        });
    } else {
      this.homeService.addLike(data).subscribe((datas: ResponseData) => {
        if (datas.isok) {
          this.getComment();
        }
      });
    }
  }
  addLikes(isLike = false) {
    let isLogin = sessionStorage.getItem("isLogin");
    if (isLogin == null || isLogin === "") {
      this.headerCom.login();
      return;
    }
    let data = {};
    data["blogId"] = this.blogId;
    let that = this;
    if (isLike) {
      this.homeService
        .deleteBlogLike(this.blogId)
        .subscribe((datas: ResponseData) => {
          if (datas.isok) {
            that.getBlogDetail();
          }
        });
    } else {
      this.homeService.addBlogLike(data).subscribe((datas: ResponseData) => {
        if (datas.isok) {
          this.getBlogDetail();
          let senddata = {};
          senddata["authorId"] = datas.data.authorId;
          senddata["userId"] = sessionStorage.getItem("user_id");
          senddata["message"] =
            "<b>" +
            this.user.userName +
            "</b>赞了你的文章<b>" +
            this.blogData.blog.blogTitle +
            "</b>";
          this.websocketService.sendMessage(JSON.stringify(senddata));
        }
      });
    }
  }
  addReplayTemplate(i, data = "") {
    let isLogin = sessionStorage.getItem("isLogin");
    if (isLogin == null || isLogin === "") {
      this.headerCom.login();
      return;
    }
    this.replayValue = "";
    if (data !== "") {
      this.replayValue = "回复:" + data["commentUser"][0].user_nickname;
    }
    if (this.commentData[i].ishow) {
      this.commentData[i].ishow = false;
    } else {
      this.commentData = this.commentData.map((e, t: number, a) => {
        return {
          ...e,
          ishow: false,
          index: t
        };
      });
      this.commentData[i].ishow = true;
    }
    this.childComent = data;
  }
  submitCom(id) {
    let data = {};

    data["blogId"] = this.blogId;
    data["commentContent"] = this.replayValue;
    data["parentCommentId"] = id;
    data["commentLikeCount"] = 0;
    if (this.childComent !== "") {
    }
    this.addComment(data);
  }
  ngOnInit() {
    this.blogId = this.activedRoute.snapshot.params["id"];
    let leftMainHeight = window.innerHeight;
    let mainHeight = document.getElementById("mainHeight");

    mainHeight.style.height = leftMainHeight - 180 + "px";
    this.changeLanguage();
    this.getComment();
    this.getBlogDetail();
    let isLogin = sessionStorage.getItem("isLogin");
    if (isLogin != null && isLogin !== "") {
      this.getUserDetail();
    }
  }
}
