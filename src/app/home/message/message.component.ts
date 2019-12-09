import { Component, OnInit } from "@angular/core";

import { WebSocketService } from "../../common/web-socket.service";
import { HomeService } from "../home.service";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.css"]
})
export class MessageComponent implements OnInit {
  dataSet = null;
  constructor(
    private homeService: HomeService,
    private websocketService: WebSocketService
  ) {}

  getAllMsg() {
    this.homeService.getAllMsg().subscribe(datas => {
      this.dataSet = datas.data;
    });
  }

  ngOnInit() {
    this.getAllMsg();
  }
}
