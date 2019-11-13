export class User {
  userId = "";
  userName = "";
  userPassword = "";
  userRole = "";
  userSex = "";
  userImgurl = "";
  userIp = "";
  userNickname = "";
  userEmail = "";
  userCreatedTime = "";
  userUpdatedTime = "";
  userBirthday = "";
  userTelephone = "";
  checkPassword = "";
  userDeclaration = "";
}
export class Tag {
  tagId = "";
  tagName = "";
  tagAlias = "";
  tagCreatedTime = "";
  tagDescription = "";
}
export class Blog {
  blogId = "";
  userId = "";
  blogTitle = "";
  blogContent = "";
  blogViews = "";
  blogCommentCount = "";
  blogLikeCount = "";
  blogCreatedTime = "";
  blogUpdatedTime = "";
  tagName: any;
}
export class ResponseData {
  isok: boolean;
  msg: string;
  data: any;
}
