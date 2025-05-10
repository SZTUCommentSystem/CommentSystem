import request from "@/utils/https";

// 获取批语列表
export const getCommentList = (params: any) => {
  return request({
    url: "function/comment/list",
    method: "get",
    params,
  });
};

// 获取批语详情
export const getCommentDetail = (id: string) => {
  return request({
    url: `function/comment/${id}`,
    method: "get",
  });
};

// 创建批语
export const createComment = (data: any) => {
  return request({
      url: " function/comment",
    method: "post",
    data,
  });
};

// 更新批语
export const updateComment = (id: string, data: any) => {
  return request({
      url: `function/comment/${id}`,
    method: "put",
    data,
  });
};

// 删除批语
export const deleteComment = (id: string) => {
  return request({
      url: `function/comment/${id}`,
    method: "delete",
  });
};
