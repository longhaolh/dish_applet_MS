<template>
	<div class="common-layout container">
		<el-container>
			<el-header width="100vw">
				<!-- <h2>浩点餐后台管理系统</h2> -->
			</el-header>
			<el-container>
				<el-aside width="200px">
					<SideMenu @indexChange="menuIndexChange"></SideMenu>
				</el-aside>
				<el-main>
					<el-page-header :icon="null" title=" ">
						<template #content>
							<span class="text-large font-600 mr-3"> {{ activeTitle }} </span>
						</template>
					</el-page-header>
					<Rigister v-if="menuIndex == '1-1'" :pageMode="'register'"></Rigister>
					<UserList v-if="menuIndex == '1-2'" @indexChange="menuIndexChange"></UserList>
					<Rigister v-if="menuIndex == '1-3'" :pageMode="'edit'"  @indexChange="menuIndexChange"></Rigister>
					<AddShop v-if="menuIndex == '2-1'"></AddShop>
					<ShopList v-if="menuIndex == '2-2'"></ShopList>
					<AddCategory v-if="menuIndex=='3-1'"></AddCategory>
					<AddDish v-if="menuIndex=='4-1'"></AddDish>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>
<script setup>
	import {
		useRoute,
		useRouter
	} from "vue-router";
	import {
		ref,
		reactive,
		onMounted,
		watch
	} from "vue";
	import Rigister from "../../components/register-user/index.vue"
	import SideMenu from "../../components/side-menu/index.vue"
	import UserList from "../../components/user-list/index.vue"
	import AddShop from "../../components/shop/addShop.vue"
	import ShopList from "../../components/shop/shopList.vue"
	import getMenuTitle from '../../utils/tool.js' 
	import AddCategory from "../../components/category/addCategory.vue"
	import AddDish from "../../components/dish/addDish.vue"
	const route = useRoute();
	const router = useRouter();
	let activeTitle = ref("");
	let menuIndex = ref("")
	onMounted(() => {
	});
	watch(menuIndex, (menu) => {
		activeTitle.value = getMenuTitle(menu)
	})
	const menuIndexChange = (e) => {
		menuIndex.value = e
	}
	const goBack = () => {
		router.go(-1);
	};
</script>
<style lang="scss" scoped>
	@import "./home.scss";
</style>