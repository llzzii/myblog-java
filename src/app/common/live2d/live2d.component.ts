import { Component, OnInit } from "@angular/core";
declare var live2d_settings: any;
declare var initModel: any;
@Component({
  selector: "app-live2d",
  templateUrl: "./live2d.component.html",
  styleUrls: ["./live2d.component.css"],
})
export class Live2dComponent implements OnInit {
  constructor() {}
  init() {
    try {
      live2d_settings["modelId"] = 1;
      live2d_settings["modelTexturesId"] = 87;
      initModel("/assets/live_2d/waifu-tips.json");
    } catch (err) {
      console.log("[Error] JQuery is not defined.");
    }
  }
  ngOnInit() {
    this.init();
  }
}
