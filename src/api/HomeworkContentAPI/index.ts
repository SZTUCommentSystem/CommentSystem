import request from "@/utils/https";

// 获取作业分类列表
export const getHomeworkContentListAPI = (data: any) => {
    return request({
      url: 'function/homeworkcontent/list',
      method: 'get',
      params: data
    })
}

// 获取作业分类细节
export const getHomeworkContentDetailAPI = (id: number) => {
    return request({
      url: `function/homeworkcontent/${id}`,
      method: 'get',
    })
}

// 新增作业分类
export const addHomeworkContentAPI = (data: object) => {
    return request({
      url: 'function/homeworkcontent',
      method: 'post',
      data
    })
}

// 修改作业分类
export const changeHomeworkContentAPI = (data: object) => {
    return request({
      url: 'function/homeworkcontent',
      method: 'put',
      data
    })
}

// 删除作业分类
export const deleteHomeworkContentAPI = (id: number) => {
    return request({
      url: `function/homeworkcontent/${id}`,
      method: 'delete',
    })
}