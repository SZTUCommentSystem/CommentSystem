import request from "@/utils/https";

// 获取批语列表
export const getCommentListAPI = (data: any) => {
  return request({
    url: "function/comment/list",
    method: "get",
    params: data
  });
};

// 获取批语详情
export const getCommentDetailAPI = (id: number) => {
  return request({
    url: `function/comment/${id}`,
    method: "get",
  });
};

// 创建批语
export const addCommentAPI = (data: any) => {
  return request({
    url: "function/comment",
    method: "post",
    data,
  });
};

// 更新批语
export const changeCommentAPI = (data: any) => {
  return request({
    url: "function/comment",
    method: "put",
    data,
  });
};

// 删除批语
export const deleteCommentAPI = (id: string) => {
  return request({
    url: `function/comment/${id}`,
    method: "delete",
  });
};

// 获取批语类型列表
export const getTypeListAPI = (data: any) => {
  return request({
    url: 'function/type/list',
    method: 'get',
    params: data
  })
}

// 获取批语类型细节
export const getTypeDetailAPI = (id: number) => {
  return request({
    url: `function/type/${id}`,
    method: 'get',
  })
}
// 新增批语类型
export const addTypeAPI = (data: object) => {
  return request({
    url: 'function/type',
    method: 'post',
    data
  })
}

// 修改批语类型
export const changeTypeAPI = (data: object) => {
  return request({
    url: 'function/type',
    method: 'put',
    data
  })
}

// 删除批语类型
export const deleteTypeAPI = (id: number) => {
  return request({
    url: `function/type/${id}`,
    method: 'delete',
  })
}