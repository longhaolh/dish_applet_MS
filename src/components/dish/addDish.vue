<template>
	<div class="add-dish">
		<el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="dish_form" status-icon>
			<el-form-item label="菜品名称" prop="dish_name" required>
				<el-input v-model="form.dish_name" placeholder="菜品名称" />
			</el-form-item>
			<el-form-item label="菜品价格" prop="dish_price" required>
				<el-input v-model="form.dish_price" type="number" placeholder="菜品价格" />
			</el-form-item>
			<el-form-item label="菜品折扣" prop="dish_discount" :required="discountR">
				<el-slider :disabled="!discountR" v-model="form.dish_discount" :max="0.99" :step="0.01" />
			</el-form-item>
			<el-form-item label="菜品描述" prop="dish_phone">
				<el-input v-model="form.dish_phone" placeholder="菜品描述,如:'营养丰富，口感独特，是家庭聚餐和朋友聚会的不错选择。'" />
			</el-form-item>
			<el-form-item label="菜品状态" prop="dish_status" required>
				<el-checkbox-group v-model="form.dish_status" :max="1" @change="statusChange">
					<el-checkbox label="在售" />
					<el-checkbox label="售罄" />
					<el-checkbox label="促销" />
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="菜品规格" prop="dish_weight" required>
				<el-input v-model="form.dish_weight" placeholder="请输入菜品规格,例如 500g/份" />
			</el-form-item>
			<el-form-item label="选择店铺" prop="shop_id" required>
				<el-autocomplete v-model="form.shop_id" :fetch-suggestions="querySearch" :trigger-on-focus="false"
					value-key="shop_name" placement="top" highlight-first-item clearable class="inline-input w-50"
					placeholder="请输入店铺名称/联系方式/管理账号/负责人名称来查询" @select="handleSelect" />
			</el-form-item>
			<el-form-item label="选择类目" prop="dish_assort" required>
				<el-select v-model="form.dish_assort" class="m-2" multiple :placeholder="optionText">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="菜品封面图" prop="dish_poster" required>
				<el-upload class="avatar-uploader" action="http://127.0.0.1:8888/verify/uploadDishPoster"
					:headers="{ Authorization: token }" :show-file-list="false" drag :on-success="handlePosterSuccess"
					:before-upload="beforePosterUpload">
					<img v-if="form.dish_poster" :src="form.dish_poster" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
					<span class="remark" v-if="!form.dish_poster">点击选择图片或者拖拽到此处进行上传</span>
				</el-upload>
			</el-form-item>
			<el-form-item label="菜品详情图" prop="dish_imgs">
				<el-upload v-model:file-list="form.dish_imgs" action="http://127.0.0.1:8888/verify/uploadDishImgs"
					:headers="{ Authorization: token }" list-type="picture-card" :on-preview="handleDishImgs"
					:on-remove="handleRemove" multiple :manual-upload="true">
					<el-icon>
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm($refs.formRef)">
					提交
				</el-button>
				<el-button @click="resetForm($refs.formRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus';
import fetchData from '../../request.js'
const form = reactive({
	dish_name: "",
	dish_price: 0,
	dish_discount: 0,
	shop_id: "",
	dish_assort: "",
	dish_poster: "",
	dish_imgs: [],
	dish_desc: "",
	dish_weight: "500g/份",
	dish_status: ['在售']
})
const optionText = ref('请先选择店铺')
const discountR = ref(false)
const formRef = ref(null)
const searchResults = ref([])
const rules = ref({
	dish_name: [{
		required: true,
		message: '请输入商品名称',
		trigger: 'blur'
	},
	{
		min: 1,
		max: 10,
		message: '商品名称最多只能有10个汉字',
		trigger: 'blur'
	},
	],
	dish_price: [{
		required: true,
		message: '输入商品价格',
		trigger: 'blur'
	}],
	shop_id: [{
		required: true,
		message: '请输入店铺id',
		trigger: 'blur'
	}],
	dish_assort: [{
		required: true,
		message: '请选择类目',
		trigger: 'blur'
	}],
	dish_poster: [{
		required: true,
		message: '请上传商品封面图',
		trigger: 'blur'
	}],
	dish_weight: [{
		required: true,
		message: '请输入商品规格',
		trigger: 'blur'
	}],
	dish_discount: [{
		required: discountR ? true : false,
		message: '请输入商品折扣',
		trigger: 'change'
	}],
	dish_status: [{
		required: true,
		message: '请选择商品状态',
		trigger: 'change'
	}],
})
let options = ref([])
const token = ref('')
const shop_id = ref(1)
onMounted(() => {
	getCategoryById(1)
	token.value = localStorage.getItem('LOGIN_TOKEN')
})
watch(shop_id, (id) => {
	getCategoryById(id)
})
// 查询用户数据并更新搜索结果
const querySearch = (queryString, cb) => {
	fetchData('/verify/queryShop', {
		params: {
			searchTerm: queryString
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
};
const statusChange = (e) => {
	if (e == '促销') {
		discountR.value = true
	} else {
		discountR.value = false
	}
}
const submitForm = (formEl) => {
	if (!formEl) return

	if (form.dish_status.length > 0) {
		form.dish_status = form.dish_status.join('')
		form.dish_status == '在售' ? form.dish_status = 0 : form.dish_status == '售罄' ? form.dish_status = 1 : form.dish_status == '折扣' ? form.dish_status = 2 : form.dish_status = 0
	}
	if (form.dish_imgs.length < 1) {
		form.dish_imgs = ''
	}
	form.shop_id = shop_id.value
	if (form.dish_assort.length > 1) {
		form.dish_assort = form.dish_assort.join(',')
	}
	formEl.validate((valid, fields) => {
		if (valid) {
			fetchData('/verify/addDish', {
				method: "post",
				params: {
					...form
				}
			}).then(res => {
				ElMessage.success(res.message)
				resetForm(formRef.value)
			})
		} else {
			console.log('error submit!', fields)
		}
	})

}
const getCategoryById = (id) => {
	fetchData('/api/queryAssort', {
		params: {
			shop_id: id
		}
	}).then(res => {
		let arr = []
		if (res.status === 0) {
			res.list[0].forEach(e => {
				if (e.assort_id !== -1 && e.assort_id !== 0) {
					arr.push({ label: e.assort_name, value: e.assort_id })
				}
			})
		}
		options.value = arr
		arr.length < 1 ? optionText.value = "该店铺还没有添加类目信息" : optionText.value = "请选择类目，可多选"
	})
}
const handleDishImgs = (uploadFile) => {
	dialogImageUrl.value = uploadFile.url
	dialogVisible.value = true
}
const handleRemove = () => {
	console.log(uploadFile, uploadFiles)
}
const beforePosterUpload = (rawFile) => {
	console.log(rawFile);
	if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
		ElMessage.error('只支持jpg和png文件')
		return false
	} else if (rawFile.size / 1024 / 1024 > 3) {
		ElMessage.error('请确保菜品封面图大小不超过3MB')
		return false
	} else {
		return true
	}

}
const handlePosterSuccess = (e) => {
	if (e.status !== 0) {
		ElMessage.error('菜品封面图上传失败' + e.message)
	} else {
		form.dish_poster = e.imgUrl
	}
}
const resetForm = (formEl) => {
	if (!formEl) return
	formEl.resetFields()
}
</script>

<style scoped lang="scss">
:deep(.el-slider) {
	width: 540px;
}
</style>