import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class WebSocketService {
  ws;
  constructor() {}

  connect(userName) {
    this.ws = new WebSocket(
      environment.socketApi + "/mySocket/name=" + userName
    );
    this.ws.onopen = e => {
      console.log(e.data);
      console.log("已连接");
    };
  }
  getMessage(fn = null) {
    this.ws.onmessage = e => {
      console.log(e.data);
      console.log("接收到消息了");
      if (fn != null) {
        fn.getMsg(fn, e);
      }
    };
  }
  closeConnect(fn = null) {
    this.ws.onclose = e => {
      console.log(e.data);
      console.log("断开连接");
      if (fn != null) {
        fn.call(e);
      }
    };
  }
  sendMessage(data) {
    this.ws.send(data);
  }
}
