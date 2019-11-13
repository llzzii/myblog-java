import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { CommunicationService } from "../../common/communication.service";
import { AddComponent } from "../add/add.component";
import { HomeService } from "../home.service";
import { UsersComponent } from "../users/users.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Output() changeLogin = new EventEmitter();
  @ViewChild("loginfrom") loginfromCom;
  islogin = false;
  loginForm: FormGroup;
  passwordVisible = false;
  password: string;
  username: string;
  isNewUser = false;

  // 防抖
  debounceTime = 500;
  private isUser = new Subject<any>();
  private subscription: Subscription;

  constructor(
    private modalService: NzModalService,
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private message: NzMessageService,
    private communicationService: CommunicationService
  ) {}

  openUser(): void {
    const modal = this.modalService.create({
      nzTitle: "个人信息",
      nzContent: UsersComponent,
      nzComponentParams: { username: this.username },
      nzCancelText: "取消",
      nzWidth: "800",
      nzOkText: "提交",
      nzOnOk: (componentInstance: UsersComponent) => {
        return componentInstance.submitForm();
      },
    });

    modal.afterOpen.subscribe(() => console.log("[afterOpen] emitted!"));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log("[afterClose] The result is:", result));
  }

  login(loginfrom = this.loginfromCom) {
    const modal = this.modalService.create({
      nzTitle: "登录/注册",
      nzContent: loginfrom,
      nzComponentParams: {},
      nzCancelText: "取消",
      nzOkText: "提交",
      nzOnOk: (componentInstance: AddComponent) => {
        this.submitForm();
      },
    });

    modal.afterOpen.subscribe(() => console.log("[afterOpen] emitted!"));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log("[afterClose] The result is:", result));
  }
  submitForm(): void {
    let data = {};
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
      data[i] = this.loginForm.controls[i].value;
    }
    this.homeService.login(data, this.isNewUser).subscribe(
      (datas) => {
        this.isNewUser = false;
        if (datas.isok) {
          let token = datas.data;
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("isLogin", "true");
          sessionStorage.setItem("user_name", this.username);
          this.islogin = true;

          this.communicationService.islogin = true;
          this.communicationService.username = this.username;
          this.changeLogin.emit(this.username);
        } else {
          this.message.create("error", datas.msg);
          this.islogin = false;
        }
      },
      (error) => {
        console.log(error);
        this.islogin = false;
        this.isNewUser = false;
      }
    );
  }
  isUsername(event) {
    this.isUser.next(this.username);
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.loginForm.controls.userPassword.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  logout() {
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("token");
    this.islogin = false;
    this.communicationService.islogin = false;
    this.communicationService.username = "";
    this.changeLogin.emit("");
  }
  ngOnInit() {
    if (sessionStorage.getItem("isLogin") === "true") {
      this.islogin = true;
    }
    if (sessionStorage.getItem("user_name")) {
      this.username = sessionStorage.getItem("user_name");
      this.changeLogin.emit(this.username);
    }
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      userPassword: [null, [Validators.required]],
      userNickname: [null],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });

    this.subscription = this.isUser
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe((e) => {
        let data = {};
        data["userName"] = e;
        data["userPassword"] = "";
        this.homeService.login(data, false).subscribe((datas) => {
          if (datas.data === "noUser") {
            this.isNewUser = true;
          } else {
            this.isNewUser = false;
          }
        });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
