<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="ruleFormRef">
        <el-form-item label="用户名" prop="username" required v-if="props.pageMode=='register'">
            <el-input v-model="form.username" show-message  inline-message  placeholder="5~16大小写字母组成,可以含有数字但是首位不能为数字且不能含有任何符号或汉字" />
        </el-form-item>
        <el-form-item label="密码" v-if="props.pageMode=='register'||props.pageMode=='editPwd'" prop="password" required>
            <el-input v-model="form.password" placeholder="长度在6~16位之间且必须同时包含英文、数字" type="password" show-password />
        </el-form-item>
		<el-form-item label="新密码" prop="new_password" :required="password" v-if="props.pageMode=='editPwd'">
		    <el-input v-model="form.new_password" placeholder="长度在6~16位之间且必须同时包含英文、数字" type="password" show-password />
		</el-form-item>
        <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="只能由英文字母、汉字、数字组合 1~30位 不填将生成随机昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="邮箱地址" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="用户地址" />
        </el-form-item>
		<el-form-item label="会员等级" prop="vip">
		    <el-switch v-model="vip" active-text="高级会员" inactive-text="普通会员" inline-prompt/>
		</el-form-item>
		<el-form-item label="权限等级" prop="power">
		    <el-select v-model="form.power" placeholder="权限等级">
		        <el-option
		          v-for="item in powerOptions"
		          :key="item.value"
		          :label="item.label"
		          :value="item.value"
		          :disabled="item.disabled"
		        />
		      </el-select>
		</el-form-item>
        <el-form-item label="头像" prop="avatarUrl" v-if="pageMode=='edit'">
			<template #default="scope">
			    <el-upload class="avatar-uploader" action="http://127.0.0.1:8888/verify/updateAvatar"
			        :headers="{ Authorization: token }" :show-file-list="false" :data="{id: form.id}" drag :on-success="handleAvatarSuccess"
			        :before-upload="beforeAvatarUpload">
			        <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar" />
			        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
			        <span class="remark" v-if="!form.avatarUrl">点击选择图片或者拖拽到此处进行上传</span>
			    </el-upload>
			</template>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import fetchData from '../../request.js'
const ruleFormRef = ref(null); // 创建表单的引用
const emit = defineEmits(['indexChange'])
let token = ref('')
const props = defineProps({
  pageMode: String
})
const vip = ref(false)
let form = reactive({});
const powerOptions = ref([])
onMounted(() => {
    token.value = localStorage.getItem('LOGIN_TOKEN')
	getPowerOption()
	if (props.pageMode == 'edit') {
	    // 修改表单的值
	    Object.assign(form, JSON.parse(sessionStorage.getItem('OPTION_USER_INFO')));
	    form.vip === 0 ? (vip.value = false) : (vip.value = true);
	  }
})

const rules = reactive ({
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '用户名长度必须在5~20位', trigger: 'blur' },
        { pattern: /^[A-Za-z0-9]{5,16}$/, message: '首位不能为数字且不能含有任何符号或汉字', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度必须在6~20位', trigger: 'blur' },
        { pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/, message: '密码必须同时包含英文、数字', trigger: 'blur' }
    ]
})
// 提交表单
const submitForm = () => {
    if(props.pageMode=='register'){
		// 注册前先检查表单
		if (!form.nickname) {
		    form.nickname = '食客'+Math.round(Math.random() * 100000000000)
		}
		fetchData('/api/register', {
		    method: 'POST',
		    params: {
		        ...form
		    }
		}).then(res=>{
			if(res.status===0){
				ElMessage.success(res.message)
			}
		})
	}else if(props.pageMode=='edit'){
		// 剔除掉无用字段
		delete form.phoneStr
		delete form.addressStr
		delete form.avatarUrl
		delete form.cardStr
		delete form.emailStr
		delete form.powerStr
		delete form.statusStr
		delete form.vipStr
		form.power = +form.power
		vip.value?form.vip = 1:form.vip = 0
		console.log(form);
		fetchData('/verify/editUserInfo', {
		    method: 'POST',
		    params: {
		        ...form
		    }
		}).then(res=>{
			if(res.status===0){
				resetForm()
				emit('indexChange', '1-2');
				ElMessage.success(res.message)
			}
		})
	}
}
// 获取可操作的权限列表
const getPowerOption =()=>{
	fetchData('verify/queryPower',{
		method:'GET'
	}).then(res=>{
		ElMessage.success(res.message)
		powerOptions.value = res.data
		console.log(powerOptions.value);
	})
}
const resetForm = () => {
    ruleFormRef.value.resetFields(); // 使用表单引用进行重置
}
const handleAvatarSuccess = (e) => {
    if (e.status !== 0) {
        ElMessage.error('头像上传失败'+e.message)
    } else {
        form.avatarUrl = e.avatarUrl
    }
}
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('只支持jpg和png文件')
        return false
    } else if (rawFile.size / 1024 / 1024 > 3) {
        ElMessage.error('请确保头像大小不超过3MB')
        return false
    }
    return true
}
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>