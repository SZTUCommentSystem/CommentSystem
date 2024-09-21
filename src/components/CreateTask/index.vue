<script lang="ts" setup>
</script>

<template>
    <div>
        <h2>新建作业</h2>
        <div class="create_title">
            <p>标题：</p><br>
            <input type="text" placeholder="请输入作业标题" />
        </div>
        <div class="create_title">
            <p>描述：</p><br>
            <input type="text" placeholder="请输入作业简介" />
        </div>
    </div>
</template>

<style scoped>
.create_title {
    display: flex;
    align-items: center;
    width: 63vw;
    height: 10vh;
    margin-top: 20px;
    padding-left: 20px;
    background-color: #fff;

    p {
        margin: 0;
        font-size: 1.5vw;
    }

    input {
        width: 56vw;
        height: 6vh;
        padding-left: 10px;
        border: 1px solid #ccc;

        &:focus {
            outline: none;
        }
    }
}
</style>