<template>
    <div class="common-layout container">
        <el-container>
            <el-header width="100vw">
                <!-- <h2>浩点餐后台管理系统</h2> -->
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                        default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose">
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <UserFilled />
                                </el-icon>
                                <span>用户管理</span>
                            </template>
                            <el-menu-item-group title="添加用户">
                                <el-menu-item index="1-1">添加用户</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="用户列表">
                                <el-menu-item index="1-2">用户列表</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                        <el-menu-item index="2">
                            <el-icon>
                                <Grid />
                            </el-icon>
                            <span>类目管理</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <el-icon>
                                <Dish />
                            </el-icon>
                            <span>菜品管理</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-page-header @back="goBack">
                        <template #content>
                            <span class="text-large font-600 mr-3"> {{ activeTitle }} </span>
                        </template>
                    </el-page-header>
                    <Rigister></Rigister>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue'
import Rigister from '../../components/register-user/index.vue'
const route = useRoute();
const router = useRouter();
let activeTitle = ref('')


const goBack = () => {
    router.go(-1);
};

const handleOpen = () => {

}
const handleClose = () => {

}
</script>
<style lang="scss" scoped>
@import './home.scss';
</style>