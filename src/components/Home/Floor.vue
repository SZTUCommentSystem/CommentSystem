<script setup>
</script>

<template>
    <div class="footer">
        <div class="up_footer">
            <ul>
                <li>
                    <p>联系电活： 张老师 1111111111</p>
                </li>
                <li>
                    <p>技术支持： 张工 1111111111</p>
                </li>
                <li>
                    <p>服务电话： 张老师 1111111111</p>
                </li>
            </ul>
        </div>
        <div class="down_footer">
            <p>Copyright@2023-2023 shenzhenjishudaxue</p>
        </div>
    </div>
</template>

<style scoped>
.footer {
    color: #BCBEC2;
    font-size: 13px;
    background-color: #1E2023;
}

.up_footer {
    display: flex;
    justify-content: center;
    align-items: center;

    ul {
        margin: 10px;

        li {
            float: left;
            padding: 0 20px;
            border-right: 1px solid #BCBEC2;

            p {
                margin: 0;
            }

            &:last-child {
                border-right: none;
            }
        }
    }

}

.down_footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

@media (max-width:768px) {
    .footer {
        font-size: 10px;
    }

    .up_footer {
        ul {
            li {
                padding: 0 5px;
            }
        }
    }
}
</style>
