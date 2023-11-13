<template>
	<div class="shop-container">
		<el-form ref="shopFormRef" :model="shopForm" :rules="rules" label-width="120px" class="shop_form" status-icon>
			<el-form-item label="店铺名称" prop="shop_name" required>
				<el-input v-model="shopForm.shop_name" placeholder="店铺名称 2~30个字符" />
			</el-form-item>
			<el-form-item label="店铺地址" prop="shop_address" required>
				<el-input v-model="shopForm.shop_address" placeholder="店铺地址" />
			</el-form-item>
			<el-form-item label="店铺负责人" prop="shop_host" required>
				<el-input v-model="shopForm.shop_host" placeholder="店铺负责人 2~20个汉字" />
			</el-form-item>
			<el-form-item label="店铺联系电话" required prop="shop_phone">
				<el-input v-model="shopForm.shop_phone" placeholder="店铺联系电话" />
			</el-form-item>
			<el-form-item label="店铺状态" prop="shop_status" required>
				<el-checkbox-group v-model="shopForm.shop_status" :max="1" @change="statusChange">
					<el-checkbox label="正常营业"/>
					<el-checkbox label="暂停营业"/>
					<el-checkbox label="封店"/>
					<el-checkbox label="注销"/>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="店铺管理账号" prop="shop_admin" required>
				  <el-autocomplete
				      v-model="shopForm.shop_admin"
				      :fetch-suggestions="querySearch"
				      :trigger-on-focus="false"
					  value-key="username"
					  placement="top"
					  highlight-first-item
				      clearable
				      class="inline-input w-50"
				      placeholder="店铺管理人账号"
				      @select="handleSelect"
				    />
			</el-form-item>
			<el-form-item label="店铺营业执照" prop="shop_license">
				<el-upload class="avatar-uploader" action="http://127.0.0.1:8888/verify/uploadLicense"
					:headers="{ Authorization: token }" :show-file-list="false" drag :on-success="handleLicenseSuccess"
					:before-upload="beforeLicenseUpload">
					<img v-if="shopForm.shop_license" :src="shopForm.shop_license" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
					<span class="remark" v-if="!shopForm.shop_license">点击选择图片或者拖拽到此处进行上传</span>
				</el-upload>
			</el-form-item>
			<el-form-item label="店铺海报" prop="shop_banner">
				<el-upload
				    v-model:file-list="bannerList"
				    action="http://127.0.0.1:8888/verify/uploadBannerList"
					:headers="{ Authorization: token }"
				    list-type="picture-card"
				    :on-preview="handlePictureCardPreview"
				    :on-remove="handleRemove"
					multiple
					 :manual-upload="true"
				  >
				    <el-icon><Plus /></el-icon>
				  </el-upload>
			</el-form-item>
			<el-form-item label="店铺账户" prop="shop_card">
				<el-input v-model="shopForm.shop_card" placeholder="店铺收款账户" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm(shopFormRef)">
					提交
				</el-button>
				<el-button @click="resetForm(shopFormRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
	import { ElMessage } from 'element-plus';
import {
		ref,
		reactive,
		onMounted,
		watch
	} from 'vue'
import fetchData from '../../request';
	const shopFormRef = ref(null)
	const shopForm = ref({
	    shop_name: '测试店铺1',
	    shop_address: '测试地址测试地址测试地址测试地址测试地址',
	    shop_host: '张三',
	    shop_phone: '17754412627',
	    shop_status: [], 
	    shop_admin: 'user111',
	    shop_license: '',
	    shop_banner: [],
	    shop_card: ''
	})
	const dialogImageUrl = ref('')
	const dialogVisible = ref(false)
	const token = ref('')
	const searchResults = ref([]); // 用于存储搜索结果的数组
	const rules = ref({
		shop_name: [{
				required: true,
				message: '店铺名称不能为空',
				trigger: 'blur'
			},
			{
				min: 2,
				max: 30,
				message: '店铺名称必须在2~30个字符 ',
				trigger: 'blur'
			},
		],
		shop_address: [{
				required: true,
				message: '店铺地址不能为空',
				trigger: 'blur'
			},
			{
				min: 10,
				max: 255,
				message: '店铺地址必须在最少10个字符 ',
				trigger: 'blur'
			},
		],
		shop_phone: [{
				required: true,
				message: '店铺联系电话不能为空',
				trigger: 'blur'
			},
			{
				min: 6,
				max: 12,
				message: '店铺联系电话必须在6~12个字符 ',
				trigger: 'blur'
			},
		],
		shop_host: [{
				required: true,
				message: '店铺负责人姓名不能为空',
				trigger: 'blur'
			},
			{
				min: 2,
				max: 20,
				message: '店铺负责人姓名必须在2~20个字符 ',
				trigger: 'blur'
			},
		],
		shop_status: [{
				required: true,
				message: '店铺状态不能为空',
				trigger: 'change'
			}
		],
		shop_admin: [
			{
				required: true,
				message: '店铺管理员账号不能为空',
				trigger: 'blur'
			},
			{
				min: 5,
				max: 16,
				message: '店铺管理员账号必须在5~16个字符 ',
				trigger: 'blur'
			},
		]
	})
	const bannerList = ref([])
	const shop_id = ref(0)
	watch(bannerList, async (banner) => {
		if(banner){
			formatBanner()
		}
	});
	onMounted(()=>{
		token.value = localStorage.getItem('LOGIN_TOKEN')
	})
	const formatBanner = ()=>{
		const banner = bannerList.value
		let arr = []
		banner.forEach(e=>{
			setTimeout(()=>{
				arr.push(e.response.imgUrl)
				if (banner.length > 1) {
				    shopForm.value.shop_banner = arr.join(',');
				} else {
				    shopForm.value.shop_banner = arr.join('');
				}
			},30)
		})
		console.log(shopForm.value);
	}
	const statusChange = (e)=>{
		console.log(e,shopForm.value);
	}

	// 查询用户数据并更新搜索结果
	const querySearch = (queryString, cb) => {
	  fetchData('/verify/queryUserSelect', {
		params: {
		  word: queryString
		}
	  }).then(res => {
		const list = res.data;
		searchResults.value = queryString ? list : []; // 更新搜索结果数组
		cb(searchResults.value); // 将结果传递给自动补全组件
	  });
	};

	// 处理选择事件
	const handleSelect = (value) => {
		shop_id.value = value.shop_id
	  console.log('Selected:', value);
	};
	const handleLicenseSuccess = (e) => {
	    if (e.status !== 0) {
	        ElMessage.error('营业执照上传失败'+e.message)
	    } else {
	        shopForm.value.shop_license = e.imgUrl
	    }
	}
	const beforeLicenseUpload = (rawFile) => {
	    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
	        ElMessage.error('只支持jpg和png文件')
	        return false
	    } else if (rawFile.size / 1024 / 1024 > 1) {
	        ElMessage.error('请确保营业执照大小不超过1MB')
	        return false
	    }
	    return true
	}
	const handleRemove = (uploadFile, uploadFiles) => {
	  console.log(uploadFile, uploadFiles)
	}
	
	const handlePictureCardPreview = (uploadFile) => {
	  dialogImageUrl.value = uploadFile.url
	  dialogVisible.value = true
	}
	const submitForm = (formEl) => { 
		if (!formEl) return
		
		if(shopForm.value.shop_status.length>0){
			shopForm.value.shop_status = shopForm.value.shop_status.join('')
			shopForm.value.shop_status =='正常营业'?shopForm.value.shop_status = 0:shopForm.value.shop_status =='暂停营业'?shopForm.value.shop_status =1:shopForm.value.shop_status =='封店'?shopForm.value.shop_status =2:shopForm.value.shop_status =='注销'?shopForm.value.shop_status =3:shopForm.value.shop_status =0
		}
		if(shopForm.value.shop_banner.length<1){
			shopForm.value.shop_banner = ''
		}
		formEl.validate((valid, fields) => {
			if (valid) {
				fetchData('/verify/addShop',{
					method:"post",
					params:{
						...shopForm.value
					}
				}).then(res=>{
					ElMessage.success(res.message)
				})
				console.log(shopForm.value);
			} else {
				console.log('error submit!', fields)
			}
		})
		
		
	}
	
	const resetForm = (formEl) => {
		if (!formEl) return
		formEl.resetFields()
	}
</script>

<style scoped lang="scss">
</style>