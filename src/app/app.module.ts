import { CommonModule, registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import zh from "@angular/common/locales/zh";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import * as enDateLocale from "date-fns/locale/zh_cn";
import { NZ_DATE_LOCALE, NZ_I18N, NgZorroAntdModule, NzI18nService, zh_CN } from "ng-zorro-antd";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CommonsModule } from "./common/commons.module";
import { InterceptorProvider } from "./common/httpCommon/interceptor-provider";
registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    CommonsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [InterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
