import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";

import { HomeService } from "../home.service";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  addBlog: FormGroup;

  id = 0;
  userName = "";
  catalogs = [];
  articleInfo = [];
  catalogName = "";
  isLoading = false;
  listOfOption: Array<{ tagName: string; tagId: string }> = [];
  listOfTagOptions = [];
  allTags = [];
  content: any;
  title;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private homeService: HomeService,
    private message: NzMessageService,
    private router: Router
  ) {}

  submit(mid, tag_ids): void {
    this.isLoading = true;
    let data = {};
    data["blogTitle"] = this.title;
    data["tagName"] = this.listOfTagOptions;
    data["blogContent"] = this.content;

    this.homeService.addBlogs(data).subscribe(
      datas => {
        this.isLoading = false;
        if (datas.isok) {
          this.message.create("success", "添加成功");
          this.router.navigate(["./home/detail/" + datas.data.blogId]);
          this.message.remove(mid);
        } else {
          this.message.create("error", `${datas.msg}`);
          this.message.remove(mid);
        }
      },
      error => {
        this.isLoading = false;
        this.message.remove(mid);
      }
    );
  }
  getHtmlValue(e) {
    this.content = e.value;
  }

  getTags() {
    // const children: Array<{ label: string; value: string }> = [];
    // for (let i = 10; i < 36; i++) {
    //   children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    // }
    // this.listOfOption = children;
    this.homeService.getTags().subscribe(datas => {
      this.listOfOption = datas.data;
      let that = this;
      this.listOfOption.forEach(v => {
        that.allTags.push(v.tagName);
      });
    });
  }

  updateTags() {
    // let that = this;
    // this.listOfTagOptions.forEach((v, i, arr) => {
    //   if (that.allTags.indexOf(v) === -1) {
    //     this.homeService.addTag(v).subscribe((datas) => {
    //       if (datas.isok) {
    //         that.getTags();
    //       }
    //     });
    //   }
    // });
    console.log(this.listOfTagOptions);
  }

  addTags() {
    const mid = this.message.loading("正在添加中", { nzDuration: 0 }).messageId;
    this.homeService.addTag(this.listOfTagOptions).subscribe(
      datas => {
        if (datas.isok) {
          this.submit(mid, datas.data);
        } else {
          this.message.create("error", `${datas.msg}`);
          this.message.remove(mid);
        }
      },
      error => {
        this.message.remove(mid);
      }
    );
  }

  ngOnInit() {
    this.addBlog = this.fb.group({
      title: [null, [Validators.required]],
      tagss: [null, [Validators.required]]
    });
    this.getTags();
    let leftMainHeight = window.innerHeight;
    let mainHeight = document.getElementById("mainHeight");

    mainHeight.style.height = leftMainHeight - 100 + "px";
  }
  AfterViewInit() {}
}
