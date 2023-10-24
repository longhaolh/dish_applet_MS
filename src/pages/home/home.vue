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
					<el-page-header @back="goBack">
						<template #content>
							<span class="text-large font-600 mr-3"> {{ activeTitle }} </span>
						</template>
					</el-page-header>
					<Rigister v-if="menuIndex == '1-1'" :pageMode="'register'"></Rigister>
					<Rigister v-if="menuIndex == '1-3'" :pageMode="'edit'"></Rigister>
					<UserList v-if="menuIndex == '1-2'"></UserList>
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
	import getMenuTitle from '../../utils/tool.js' 
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