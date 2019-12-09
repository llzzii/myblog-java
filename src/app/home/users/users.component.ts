import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NzI18nService,
  NzMessageService,
  UploadFile,
  zh_CN
} from "ng-zorro-antd";

import { environment } from "../../../environments/environment";
import { User } from "../../entity";
import { HomeService } from "../home.service";
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  validateForm: FormGroup;
  rowdata: User;
  @Output() createSucceed = new EventEmitter();
  @Input() username;

  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = "";
  previewVisible = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private homeService: HomeService,
    private i18n: NzI18nService
  ) {}

  submitForm(): boolean {
    let data = {};
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      data[i] = this.validateForm.controls[i].value;
    }
    if (!this.validateForm.valid) {
      return false;
    }
    data["userName"] = this.username;
    this.update(data);
    return true;
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  update(data) {
    const mid = this.message.loading("正在修改中", { nzDuration: 0 }).messageId;
    this.homeService.updateUser(data).subscribe(
      respose => {
        this.createSucceed.emit();
        this.message.create(
          `${respose.isok === true ? "success" : "error"}`,
          `${respose.msg}`
        );
        this.message.remove(mid);
      },
      error => {
        this.message.remove(mid);
      }
    );
  }
  changeLanguage(): void {
    this.i18n.setLocale(zh_CN);
  }
  getUserDetail() {
    if (!this.username) {
      this.username = sessionStorage.getItem("user_name");
    }
    this.homeService.getUser(this.username).subscribe(datas => {
      this.rowdata = datas.data;
      this.validateForm = this.fb.group({
        userSex: [this.rowdata.userSex],
        userNickname: [
          this.rowdata.userNickname,
          [
            Validators.pattern("^[\u4e00-\u9fa5A-Za-z0-9-_]+$"),
            Validators.maxLength(36)
          ]
        ],
        userEmail: [this.rowdata.userEmail, [Validators.email]],
        userBirthday: [this.rowdata.userBirthday],
        userTelephone: [
          this.rowdata.userTelephone,
          [Validators.pattern("^1[3456789]\\d{9}$")]
        ],
        userDeclaration: [
          this.rowdata.userDeclaration,
          [Validators.maxLength(255)]
        ]
      });
      if (this.rowdata.userImgurl && this.rowdata.userImgurl !== "") {
        this.fileList = [
          {
            status: "done",
            url: environment.serviceApi + this.rowdata.userImgurl
          }
        ];
      }
    });
  }

  ngOnInit(): void {
    this.getUserDetail();
    this.changeLanguage();
  }
}
