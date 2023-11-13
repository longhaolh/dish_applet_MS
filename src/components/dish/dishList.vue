<template>
    <div class="dish-list">
        <el-row>
            <el-input v-model="SearchWord" class="w-50 m-2" label="搜索用户" placeholder="输入搜索内容 昵称/手机号/账号/邮箱"
                :prefix-icon="Search" clearable @input="searchShop"></el-input>
        </el-row>
        <el-table :data="dishlist" empty-text="暂无数据" ref="tableRef" stripe>
            <el-table-column fixed label="操作" width="350">
                <template #default="scope">
                    <div style="display: flex;justify-content: center; align-items: center">
                        <el-button :disabled="scope.row.status > 0 || dishinfo.power <= scope.row.power" type="primary"
                            round @click="editDish(scope.row)">编辑</el-button>
                        <el-button :disabled="scope.row.status > 0 || dishinfo.power <= scope.row.power" type="info" round
                            @click="banDish(scope.row.shop_id)">封店</el-button>
                        <el-button :disabled="scope.row.status === 2 || dishinfo.power <= scope.row.power" type="danger"
                            round @click="deleteDish(scope.row.shop_id)">注销</el-button>
                        <el-button :disabled="scope.row.status === 0 || dishinfo.power <= scope.row.power" type="success"
                            round @click="restoreDish(scope.row.shop_id)">恢复</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shop_id" label="ID" width="100" />
            <el-table-column prop="shop_admin" label="管理员账号" width="150" />
            <el-table-column prop="shop_name" label="昵称" width="200" />
            <el-table-column prop="shop_license" label="营业执照" width="100">
                <template #default="scope">
                    <div style="display: flex;justify-content: center; align-items: center">
                        <el-image v-if="scope.row.shop_license" :preview-teleported="true" :src="scope.row.shop_license"
                            fit="scale-down" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shop_banner" label="店铺海报" width="100">
                <template #default="scope">
                    <span v-if="!scope.row.shop_banner">未上传</span>
                    <div v-if="scope.row.shop_banner" style="display: flex;justify-content: center; align-items: center">
                        <el-image style="width: 100px; height: 100px" :src="scope.row.shop_banner[0]" :zoom-rate="1.2"
                            :max-scale="3" :min-scale="0.2" :preview-teleported="true" :infinite="false"
                            :preview-src-list="scope.row.shop_banner || []" :initial-index="0" fit="scale-down" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shop_host" label="负责人姓名" width="250" />
            <el-table-column prop="shop_phone" label="店铺联系电话" width="200" />
            <el-table-column prop="shop_address" label="店铺地址" width="500" />
            <el-table-column prop="shop_card" label="店铺提现卡号" width="200">
                <template #default="scope">
                    <div style="display: flex; justify-content: center;align-items: center;">
                        <span v-if="scope.row.shop_card">{{ scope.row.shop_card }}</span><span
                            v-if="!scope.row.shop_card">未绑定</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="shop_status" label="状态" width="100">
                <template #default="scope">
                    <div style="display: flex; justify-content: center;align-items: center">
                        <el-tag class="ml-2" type="success" v-if="scope.row.shop_status === 0">正常营业</el-tag>
                        <el-tag class="ml-2" type="info" v-if="scope.row.shop_status === 1">暂停营业</el-tag>
                        <el-tag class="ml-2" type="danger" v-if="scope.row.shop_status === 2">封店</el-tag>
                        <el-tag class="ml-2" type="danger" v-if="scope.row.shop_status === 3">注销</el-tag>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="display: flex; justify-content: center;width: 100%;height: 60px;">
            <el-pagination @current-change="currentChange" background layout="prev, pager, next" :page-count="max_count"
                :total="total" :page-size="page_count" />
        </el-row>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import fetchData from '../../request.js'
import { DishFilled, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['indexChange'])
const dishlist = ref([])
const dishinfo = ref({ power: 3 })
let page_number = ref(1)
const page_count = ref(10)
const tableRef = ref(null)
let SearchWord = ref('')
let canSearch = ref(true)
let total = ref(0)
let max_count = ref(0)
onMounted(() => {
    getDishList()
})
watch(page_number, (num) => {
    if (num) {
        getDishList()
    }
});
// 搜索用户
const searchShop = () => {
    if (canSearch.value) {
        canSearch.value = false
        setTimeout(() => {
            canSearch.value = true
        }, 200)
        if (!SearchWord.value) {
            getDishList()
            return
        }
        fetchData('/verify/queryShop', {
            method: 'GET',
            params: {
                searchTerm: SearchWord.value
            }
        }).then(res => {
            dishlist.value = formatDish(res.data)
            total.value = res.total
        })
    }
}
// 格式化dish数据
const formatDish = (shop) => {
    shop.forEach((e) => {
        if (e.shop_banner) {
            e.shop_banner = e.shop_banner.split(',') || []
        }
    })
    return shop
}
// 页码改变
const currentChange = (e) => {
    page_number.value = e
}
// 获取用户列表
const getDishList = () => {
    fetchData('/verify/getAllShop', {
        params: {
            page_number: page_number.value,
            page_count: page_count.value
        }
    }).then(res => {
        total.value = res.total
        max_count.value = Math.ceil(res.total / page_count.value)
        dishlist.value = formatDish(res.data)
    })
}
// 编辑用户
const editDish = (dish) => {
    sessionStorage.setItem('OPTION_USER_INFO', JSON.stringify(dish))
    emit('indexChange', '1-3')
}
// 封禁账号
const banDish = (id) => {
    ElMessageBox.confirm(
        "确认要将该用户标记为'封号'吗",
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        fetchData('/verify/banDish', {
            method: 'POST',
            params: {
                id
            }
        }).then(res => {
            getDishList()
            ElMessage.success(res.message)
        })
    })
}
// 恢复注销用户
const restoreDish = (id) => {
    ElMessageBox.confirm(
        "确认要将该用户标记为'正常'吗",
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(() => {
        fetchData('/verify/restoreDish', {
            method: 'POST',
            params: {
                id
            }
        }).then(res => {
            getDishList()
            ElMessage.success(res.message)
        })
    })
}
// 注销用户
const deleteDish = (id) => {
    ElMessageBox.confirm(
        "确认要将该用户标记为'已注销'吗",
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        fetchData('/verify/deleteDish', {
            method: 'POST',
            params: {
                id
            }
        }).then(res => {
            getDishList()
            ElMessage.success(res.message)
        })
    })
}
</script>

<style scoped lang="scss">
.dish-list {
    max-width: 85vw;
    height: 60%;

    :deep(.el-table) {
        height: 100%;
    }

    :deep(th) {
        text-align: center;
    }

    :deep(td) {
        text-align: center;
    }

    :deep(.el-row) {
        margin-bottom: 20px;
    }
}
</style>