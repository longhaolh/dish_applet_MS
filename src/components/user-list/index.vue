<template>
	<div class="user-list">
		<el-row>
			<el-input 
				v-model="SearchWord"
				class="w-50 m-2"
				label="搜索用户"
				placeholder="输入搜索内容 昵称/手机号/账号/邮箱"
				:prefix-icon="Search"
				clearable
				@input="searchUser"
			></el-input>
		</el-row>
		<el-table :data="userlist" border empty-text="暂无数据" ref="tableRef" stripe>
			<el-table-column fixed label="操作" width="350">
				<template #default="scope">
					<div style="display: flex; align-items: center">
						<el-button :disabled="scope.row.status>0||userinfo.power<=scope.row.power" type="primary" round @click="editUser(scope.row)">编辑</el-button>
						<el-button :disabled="scope.row.status>0||userinfo.power<=scope.row.power" type="info" round @click="banUser(scope.row.id)">封号</el-button>
						<el-button :disabled="scope.row.status===2||userinfo.power<=scope.row.power" type="danger" round @click="deleteUser(scope.row.id)">注销</el-button>
						<el-button :disabled="scope.row.status===0||userinfo.power<=scope.row.power" type="success" round @click="restoreUser(scope.row.id)">恢复</el-button>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="ID" width="100" />
			<el-table-column prop="username" label="账号" width="150" />
			<el-table-column prop="nickname" label="昵称" width="200" />
			<el-table-column prop="avatar" label="头像" width="90">
				<template #default="scope">
			        <div style="display: flex; align-items: center">
						<el-avatar shape="square" size="large" :icon="UserFilled" :src="scope.row.avatar" />
			        </div>
			    </template>
			</el-table-column>
			<el-table-column prop="emailStr" label="邮箱" width="250" />
			<el-table-column prop="phoneStr" label="手机号" width="200" />
			<el-table-column prop="addressStr" label="地址" width="500" />
			<el-table-column prop="vipStr" label="会员等级" width="100" />
			<el-table-column prop="powerStr" label="账户级别" width="100" />
			<el-table-column prop="balance" label="余额" width="100" />
			<el-table-column prop="cardStr" label="银行卡号" width="200" />
			<el-table-column prop="status" label="状态" width="100">
				<template #default="scope">
				    <div style="display: flex; align-items: center">
						<el-tag class="ml-2" type="success" v-if="scope.row.status===0">正常</el-tag>
						<el-tag class="ml-2" type="info" v-if="scope.row.status===1">封号</el-tag>
						<el-tag class="ml-2" type="danger" v-if="scope.row.status===2">已注销</el-tag>
				    </div>
				</template>
			</el-table-column>
		</el-table>
		<el-row style="display: flex; justify-content: center;width: 100%;height: 60px;">
			<el-pagination @current-change="currentChange" background layout="prev, pager, next" :page-count="max_count" :total="total" :page-size="page_count"/>
		</el-row>
	</div>
</template>

<script setup>
import {ref,reactive,onMounted,watch} from 'vue'
import fetchData from '../../request.js'
import { UserFilled,Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['indexChange'])
const userlist = ref([])
const userinfo = ref({power:3})
let page_number = ref(1)
const page_count = ref(10)
const tableRef = ref(null)
let SearchWord = ref('')
let canSearch = ref(true)
let total = ref(0)
let max_count = ref(0)
onMounted(()=>{
	getUserList()
})
watch(page_number, (num) => {
  if(num){
	getUserList()
  }
});
// 搜索用户
const searchUser = () =>{
	if(canSearch.value){
		canSearch.value = false
		setTimeout(()=>{
			canSearch.value = true
		},200)
		if(!SearchWord.value){
			getUserList()
			return
		}
		fetchData('/verify/queryUser',{
			method:'GET',
			params:{
				searchTerm:SearchWord.value
			}
		}).then(res=>{
			userlist.value = formatUser(res.data)
			total.value = res.total
		})
	}
}
// 格式化user数据
const formatUser = (user)=>{
	user.forEach((e)=>{
		!e.phone?e.phoneStr = '还未添加手机号':e.phoneStr = e.phone
		!e.email?e.emailStr = '还未添加邮箱号':e.emailStr = e.email 
		!e.address?e.addressStr = '还未添加地址':e.addressStr = e.address
		!e.card?e.cardStr = '还未添加银行卡':e.cardStr = e.card
		e.avatarUrl = e.avatar
		e.vip===0?e.vipStr='普通会员':e.vip===1?e.vipStr='高级会员':e.vipStr='数据异常'
		e.power===0?e.powerStr='普通用户':e.power===1?e.powerStr='商户':e.power===2?e.powerStr='客服':e.power===3?e.powerStr='顶级管理员':e.powerStr='数据异常'
	})
	return user
}
// 页码改变
const currentChange = (e)=>{
	page_number.value = e
}
// 获取用户列表
const getUserList = () => {
	fetchData('/verify/getAllUser',{
		method:'GET',
		params:{
			page_number:page_number.value,
			page_count:page_count.value
		}
	}).then(res=>{
		total.value = res.total
		max_count.value = Math.ceil(res.total / page_count.value)
		userlist.value = formatUser(res.data)
	})
}
// 编辑用户
const editUser = (user)=>{
	sessionStorage.setItem('OPTION_USER_INFO',JSON.stringify(user))
	emit('indexChange','1-3')
}
// 封禁账号
const banUser = (id)=>{
	ElMessageBox.confirm(
	    "确认要将该用户标记为'封号'吗",
	    '提示',
	    {
	      confirmButtonText: '确认',
	      cancelButtonText: '取消',
	      type: 'warning',
	    }
	).then(() => {
		  fetchData('/verify/banUser',{
			method:'POST',
			params:{
				id
			}
		  }).then(res=>{
			getUserList()	
			ElMessage.success(res.message)
		  })
	})
}
// 恢复注销用户
const restoreUser = (id) =>{
	ElMessageBox.confirm(
	    "确认要将该用户标记为'正常'吗",
	    '提示',
	    {
	      confirmButtonText: '确认',
	      cancelButtonText: '取消',
	      type: 'info',
	    }
	).then(() => {
		  fetchData('/verify/restoreUser',{
			method:'POST',
			params:{
				id
			}
		  }).then(res=>{
			getUserList()	
			ElMessage.success(res.message)
		  })
	})
}
// 注销用户
const deleteUser = (id) =>{
	ElMessageBox.confirm(
	    "确认要将该用户标记为'已注销'吗",
	    '提示',
	    {
	      confirmButtonText: '确认',
	      cancelButtonText: '取消',
	      type: 'warning',
	    }
	).then(() => {
		  fetchData('/verify/deleteUser',{
			method:'POST',
			params:{
				id
			}
		  }).then(res=>{
			getUserList()	
			ElMessage.success(res.message)
		  })
	})
}
</script>

<style scoped lang="scss">
.user-list{
	max-width: 85vw;
	height: 60%;
	:deep(.el-table){
		height: 100%;
	}
	:deep(th){
		text-align: center;
	}
	:deep(td){
		text-align: center;
	}
	:deep(.el-row){
		margin-bottom: 20px;
	}
}
</style>