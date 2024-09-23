<script setup lang="ts">

</script>

<template>
  <div>
    <h2 style="margin-top: 20px;">教学班级</h2>
    <div class="teach-class">
      <el-button>新建班级</el-button>
      <el-button>加入班级</el-button>
      <el-button>新手指引</el-button>
    </div>
    <div class="teach-class-list">
      <ul>
        <li>
          <div class="header">
            <p style="margin-top: 30px;">我是标题</p>
            <img src="https://via.placeholder.com/32">
            <p style="margin-top: 10px;">张老师</p>
          </div>
          <div class="footer">
            <p><img src="@/assets/img/查看.png" alt="">387</p>
            <p><img src="@/assets/img/人数.png" alt="">37</p>
            <p><img src="@/assets/img/作业.png" alt="">3</p>
          </div>
        </li>
        <li>
          <div class="header">
            <p style="margin-top: 30px;">我是标题</p>
            <img src="https://via.placeholder.com/32">
            <p style="margin-top: 10px;">我是老师</p>
          </div>
          <div class="footer">
            <p><img src="@/assets/img/查看.png" alt="">387</p>
            <p><img src="@/assets/img/人数.png" alt="">37</p>
            <p><img src="@/assets/img/作业.png" alt="">3</p>
          </div>
        </li>
        <li>
          <div class="header">
            <p style="margin-top: 30px;">我是标题</p>
            <img src="https://via.placeholder.com/32">
            <p style="margin-top: 10px;">我是老师</p>
          </div>
          <div class="footer">
            <p><img src="@/assets/img/查看.png" alt="">387</p>
            <p><img src="@/assets/img/人数.png" alt="">37</p>
            <p><img src="@/assets/img/作业.png" alt="">3</p>
          </div>
        </li>
        <li>
          <div class="header">
            <p style="margin-top: 30px;">我是标题</p>
            <img src="https://via.placeholder.com/32">
            <p style="margin-top: 10px;">我是老师</p>
          </div>
          <div class="footer">
            <p><img src="@/assets/img/查看.png" alt="">387</p>
            <p><img src="@/assets/img/人数.png" alt="">37</p>
            <p><img src="@/assets/img/作业.png" alt="">3</p>
          </div>
        </li>
        <li>
          <div class="header">
            <p style="margin-top: 30px;">我是标题</p>
            <img src="https://via.placeholder.com/32">
            <p style="margin-top: 10px;">我是老师</p>
          </div>
          <div class="footer">
            <p><img src="@/assets/img/查看.png" alt="">387</p>
            <p><img src="@/assets/img/人数.png" alt="">37</p>
            <p><img src="@/assets/img/作业.png" alt="">3</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0;
}

.teach-class {
  margin: 30px 0;

  button {
    margin-right: 10px;
    font-size: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}

.teach-class-list {
  margin-top: 55px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
  border: 1px solid #ccc;

  ul {
    display: flex;
    /* 允许换行 */
    flex-wrap: wrap;
    padding: 0;
    margin-top: 20px;

    li {
      margin: 20px 0 10px 20px;
      width: 275px;
      height: 300px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 80%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    img {
      margin-top: 40px;
      width: 85px;
      border-radius: 50px;
    }
  }

  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 20%;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top: 1px solid #ccc;

    img {
      width: 20px;
      margin-right: 3px;
      margin-top: -3px;
    }
  }
}
</style>