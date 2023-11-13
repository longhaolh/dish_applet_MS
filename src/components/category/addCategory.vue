<template>
	<div class="add-category">
		<el-form ref="cartFormRef" :model="form" :rules="rules" label-width="120px" class="shop_form" status-icon>
			<el-form-item label="类目名称" prop="category_name" required>
				<el-input v-model="form.category_name" placeholder="店铺名称 2&#126;30个字符" />
			</el-form-item>
			<el-form-item label="类目别名" prop="category_alias">
				<el-input v-model="form.category_alias" disabled />
			</el-form-item>
			<el-form-item label="类目所属店铺" prop="shop_id" required>
				  <el-autocomplete
				      v-model="form.shop_id"
				      :fetch-suggestions="querySearch"
				      :trigger-on-focus="false"
					  value-key="shop_name"
					  placement="top"
					  highlight-first-item
				      clearable
				      class="inline-input w-50"
				      placeholder="请输入店铺名称/联系方式/管理账号/负责人名称来查询"
				      @select="handleSelect"
				    />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm($refs.cartFormRef)">
					提交
				</el-button>
				<el-button @click="resetForm($refs.cartFormRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script setup>
	import {
		ref,
		reactive,
		onMounted,
		watch
	} from 'vue'
	import pinyin from 'pinyin'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import fetchData from '../../request.js'
	const form = reactive({
		category_name: "",
		category_alias: "",
		shop_id:""
	})
	const shop_id = ref(0)
	const cartFormRef = ref(null)
	const searchResults = ref([])
	const rules = ref({
		category_name: [{
				required: true,
				message: '请输入类目名称',
				trigger: 'blur'
			},
			{
				min: 1,
				max: 5,
				message: '类目名称最多只能有5个汉字',
				trigger: 'blur'
			},
		],
		shop_id:[{
			required: true,
			message: '请选择店铺',
			trigger: 'blur'
		}]
	})
	watch(form, (name) => {
		form.category_alias = pinyin(name.category_name, {
			style: pinyin.STYLE_NORMAL,
			heteronym: false,
		}).join('')
	})
	onMounted(() => {})
	const submitForm = (formRef) => {
		fetchData('/verify/addAssort',{
			method:"POST",
			params:{
				assort_name:form.category_name,
				assort_alias:form.category_alias,
				shop_id:shop_id
			}
		}).then(res=>{
			if(res.status === 0){
				ElMessage.success(res.message)
			}
		})
	}
	const resetForm = (formEl) => {
		if (formEl) {
			formEl.resetFields()
		} 
	}
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
</script>

<style scoped lang="scss">
</style>