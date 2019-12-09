import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HttpErrorInterceptor implements HttpInterceptor {
  messages = [];

  private modalRef: NzModalRef;
  private status = {
    400: "错误的请求。由于语法错误，该请求无法完成。",
    401: "未经授权。服务器拒绝响应。",
    403: "已禁止。服务器拒绝响应。",
    404: "未找到。无法找到请求的位置。",
    405: "方法不被允许。使用该位置不支持的请求方法进行了请求。",
    406: "不可接受。服务器只生成客户端不接受的响应。",
    407: "需要代理身份验证。客户端必须先使用代理对自身进行身份验证。",
    408: "请求超时。等待请求的服务器超时。",
    409: "冲突。由于请求中的冲突，无法完成该请求。",
    410: "过期。请求页不再可用。",
    411: "长度必需。未定义“内容长度”。",
    412: "前提条件不满足。请求中给定的前提条件由服务器评估为 false。",
    413: "请求实体太大。服务器不会接受请求，因为请求实体太大。",
    414: "请求 URI 太长。服务器不会接受该请求，因为 URL 太长。",
    415: "不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。",
    416: "HTTP 状态代码 {0}",
    500: "内部服务器错误。",
    501: "未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。",
    503: "服务不可用。服务器当前不可用(过载或故障)。",
    504: "（网关超时） 服务器作为网关或代理，但是没有及时从上游服务器收到请求。"
  };
  constructor(
    private nzMessageService: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let success = false;
    let response: HttpResponse<any>;
    let errorResponse: HttpErrorResponse;

    if (req.url.indexOf("document-url.json") > -1) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => {
          if (event instanceof HttpResponse) {
            success = true;
            response = event;
          }
        },
        // Operation failed; error is an HttpErrorResponse
        error => {
          success = false;
          errorResponse = error;
        }
      ),
      // 处理请求结果
      finalize(() => {
        let mess = "";
        // this.nzMessageService.remove(); // 清除会造成业务层nzMessageService消息提示的清除
        const specialErrorHandle = req.headers.get("specialErrorHandle");
        const result = response.body || {};
        if (success) {
          // 请求成功 - 业务错误的处理
          // console.log('success:', response);
          if (
            result.code &&
            result.msg &&
            result.code.toString().slice(0, 1) !== "2" &&
            result.code !== "0"
          ) {
            if (!specialErrorHandle) {
              // 非特例请求统一进行错误消息显示
              // 特例请求再HttpHeader种添加specialErrorHandle
              // 例：
              // const options = {
              //   headers: new HttpHeaders().set('specialErrorHandle', true)
              // };
              // this.http.get<Message>(url, options).pipe();
              mess = result.msg || result.code;
            }
          }
          if (result.code > 69999) {
            mess = result.msg;
          }
          // this.nzMessageService.error(msg, {nzDuration: 30000});
        } else {
          if (specialErrorHandle) {
            mess = errorResponse.error.message;
          } else {
            mess =
              errorResponse.error.message || this.status[errorResponse.status];
          }
        }
        if (mess) {
          if (this.messages.indexOf(mess) < 0) {
            this.nzMessageService.error(mess, { nzDuration: 5000 });
            this.messages.push(mess);
            setTimeout(() => {
              let index = this.messages.indexOf(mess);
              if (result.code > 69999 || errorResponse.status === 401) {
                if (this.modalRef) {
                  return;
                }
                const okLoading = false;
                this.modalRef = this.modal.info({
                  nzTitle: "登录过期",
                  nzContent: "登录已过期，点击确定跳到登录页。",
                  nzClosable: false,
                  nzOkLoading: okLoading,
                  nzOnOk: () => {
                    sessionStorage.removeItem("isLogin");
                    sessionStorage.removeItem("user_name");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user_id");
                    window.location.reload();
                  },
                  nzCancelText: null
                });
              }
              this.messages.splice(index, 1);
            }, 5000);
          }
        }
      }) // end of finalize
    );
  }
}
