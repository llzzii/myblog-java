import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";

import { COLORS } from "../../common/color";
import { Blog, ResponseData } from "../../entity";
import { HomeService } from "../home.service";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"],
})
export class ContentComponent implements OnInit {
  loading = true;
  dataList: Blog[] = [];
  current = 0;
  color = COLORS;
  loadingMore = true;
  tags = ["前端", "js", "TS", "Angular", "Vue"];
  constructor(private homeService: HomeService, private message: NzMessageService, private router: Router) {}

  getList() {
    const mids: string = this.message.loading("正在获取中", { nzDuration: 0 }).messageId;
    this.homeService.getBlogs(this.current).subscribe(
      (datas: ResponseData) => {
        this.loading = false;
        if (datas.isok) {
          this.message.create("success", "获取成功");

          this.dataList = [...this.dataList, ...datas.data];
          this.dataList.forEach((element) => {
            if (element.blogContent != null && element.blogContent !== undefined) {
              element.blogContent = element.blogContent.replace(/<\/?[^>]*>/g, "").slice(0, 100);
            }
          });
        } else {
          this.message.create("error", `${datas.msg}`);
        }
        if (datas.data.length === 0) {
          this.loadingMore = false;
        }
        this.message.remove(mids);
      },
      (error) => {
        this.message.remove(mids);
      }
    );
  }
  goToDetail(id) {
    this.router.navigate(["/home/detail/" + id]);
  }
  onLoadMore() {
    this.current = this.current + 1;
    this.getList();
  }
  ngOnInit(): void {
    this.getList();
  }
}
