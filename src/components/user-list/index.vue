<template>
	<div class="user-list">
		<el-table :data="userlist" align-center border empty-text="暂无数据" ref="tableRef">
			<el-table-column fixed label="操作" width="180">
			<template #default="scope">
			    <div style="display: flex; align-items: center">
					<el-button type="primary" round @click="editUser(scope.row.id)">编辑</el-button>
					<el-button :disabled="scope.row.status=='已注销'" type="danger" round @click="deleteUser(scope.row.id)">注销</el-button>
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
						<!-- <el-image
						      style="width: 90px"
						      :src="scope.row.avatar"
						      :zoom-rate="1"
						      :max-scale="7"
						      :min-scale="0.2"
						      :preview-src-list="userAvatar"
						      :initial-index="scope.$index"
							  :z-index="999"
						      fit="cover"
						    /> -->
			        </div>
			    </template>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="250" />
			<el-table-column prop="phone" label="手机号" width="200" />
			<el-table-column prop="address" label="地址" width="500" />
			<el-table-column prop="vip" label="会员等级" width="100" />
			<el-table-column prop="power" label="账户级别" width="100" />
			<el-table-column prop="balance" label="余额" width="100" />
			<el-table-column prop="card" label="银行卡号" width="200" />
			<el-table-column prop="status" label="状态" width="100" />
		</el-table>
	</div>
</template>

<script setup>
import {ref,reactive,onMounted} from 'vue'
import fetchData from '../../request.js'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const userlist = ref([])
let page_number = ref(1)
let page_count = ref(30)
const tableRef = ref(null)
let userAvatar = ref([])
onMounted(()=>{
	getUserList()
})
const getUserList = () => {
	fetchData('/verify/getAllUser',{
		method:'GET',
		params:{
			page_number:page_number.value,
			page_count:page_count.value
		}
	}).then(res=>{
		res.data.forEach((e)=>{
			!e.phone?e.phone = '还未添加手机号':e.phone
			!e.email?e.email = '还未添加邮箱号':e.email 
			!e.address?e.address = '还未添加地址':e.address
			!e.card?e.card = '还未添加银行卡':e.card
			e.status===0?e.status='正常':e.status===1?e.status='封号':e.status===2?e.status='已注销':e.status='数据异常'
			e.vip===0?e.vip='普通会员':e.vip===1?e.vip='高级会员':'数据异常'
			e.power===0?e.power='普通用户':e.power===1?e.power='商户':e.power===2?e.power='普通管理员':e.power===3?e.power='顶级管理员':e.power='数据异常'
			userAvatar.value.push(e.avatar)
		})
		userlist.value = res.data
	})
}
const deleteUser = (id) =>{
	console.log(id);
	sessionStorage.setItem('OPTION_USER_ID',id)
	ElMessageBox.confirm(
	    "确认要将该用户标记为'已注销'吗",
	    '提示',
	    {
	      confirmButtonText: '确认',
	      cancelButtonText: '取消',
	      type: 'warning',
	    }
	  )
	    .then(() => {
	      // fetchData()
	    })
	    .catch(() => {
	      
	    })
}
</script>

<style scoped lang="scss">
.user-list{
	max-width: 85vw;
	height: 70%;
	:deep(.el-table){
		height: 100%;
	}
	:deep(th){
		text-align: center;
	}
	:deep(td){
		text-align: center;
	}
}
</style>