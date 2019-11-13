import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgZorroAntdModule } from "ng-zorro-antd";

import { CommonsModule } from "../common/commons.module";
import { CommunicationService } from "../common/communication.service";
import { InterceptorProvider } from "../common/httpCommon/interceptor-provider";

import { AddComponent } from "./add/add.component";
import { ContentComponent } from "./content/content.component";
import { DetailComponent } from "./detail/detail.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home.component";
import { HomeService } from "./home.service";
import { LeftAiderComponent } from "./left-aider/left-aider.component";
import { RightAiderComponent } from "./right-aider/right-aider.component";
import { TypesComponent } from "./types/types.component";
import { UsersComponent } from "./users/users.component";

const routes: Routes = [
  { path: "add", component: AddComponent },
  { path: "detail/:id", component: DetailComponent },
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        children: [
          { path: "user", component: UsersComponent },
          { path: "type", component: TypesComponent },
          { path: "con", component: ContentComponent },
          { path: "", component: ContentComponent },
        ],
      },
    ],
    runGuardsAndResolvers: "always",
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    LeftAiderComponent,
    RightAiderComponent,
    ContentComponent,
    AddComponent,
    TypesComponent,
    UsersComponent,
    DetailComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    RouterModule.forChild(routes),
    CommonsModule,
    NgZorroAntdModule,
  ],
  exports: [RouterModule],
  entryComponents: [AddComponent, UsersComponent],
  providers: [HomeService, CommunicationService, InterceptorProvider],
})
export class HomeModule {}
