<template>
	<div class="menu-container">
		<el-menu active-text-color="#ffd04b" :default-openeds="['1']" default-active="1-1" unique-opened background-color="#545c64" class="el-menu-vertical-demo" text-color="#fff" ref="menuRef" @open="handleOpen" @close="handleClose">
			<el-sub-menu index="1" default-index="1-1">
				<template #title>
					<el-icon>
						<UserFilled />
					</el-icon>
					<span>用户管理</span>
				</template>
				<el-menu-item-group title="添加用户">
					<el-menu-item index="1-1" @click="selectSubMenu">添加用户</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="用户列表">
					<el-menu-item index="1-2" @click="selectSubMenu">用户列表</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="修改用户">
					<el-menu-item index="1-3" @click="selectSubMenu">修改用户</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-sub-menu index="2" default-index="2-1">
				<template #title>
					<el-icon>
						<Shop/>
					</el-icon>
					<span>店铺管理</span>
				</template>
				<el-menu-item-group title="添加店铺">
					<el-menu-item index="2-1" @click="selectSubMenu">添加店铺</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="店铺列表" >
					<el-menu-item index="2-2" @click="selectSubMenu">店铺列表</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-sub-menu index="3"  default-index="3-1">
				<template #title>
					<el-icon>
						<Grid />
					</el-icon>
					<span>类目管理</span>
				</template>
				<el-menu-item-group title="添加类目">
					<el-menu-item index="3-1" @click="selectSubMenu">添加类目</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="类目列表">
					<el-menu-item index="3-2" @click="selectSubMenu">类目列表</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
			<el-sub-menu index="4">
				<template #title>
					<el-icon>
						<Dish />
					</el-icon>
					<span>菜品管理</span>
				</template>
				<el-menu-item-group title="添加用户">
					<el-menu-item index="4-1" @click="selectSubMenu">添加用户</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="用户列表" >
					<el-menu-item index="4-2" @click="selectSubMenu">用户列表</el-menu-item>
				</el-menu-item-group>
			</el-sub-menu>
		</el-menu>
	</div>
</template>

<script setup>
import {ref,reactive,watch,computed,onMounted} from 'vue'
const menuRef = ref(null);
let activeMenu = ref('')
const emit = defineEmits(['indexChange'])
onMounted(()=>{
	menuRef.value.open(4);
	activeMenu.value = '4-1'
})
watch(activeMenu, (menu) => {
  if(menu){
	emit('indexChange', menu);
  }
});

const selectSubMenu = (e) => {
	activeMenu.value = e.index
};
const handleOpen = (e) => {
	console.log("open:", e);
};
const handleClose = (e) => {
	console.log("close:", e);
};

</script>

<style scoped lang="scss">
.menu-container{
	height: 100%;
}
:deep(.el-menu) {
  height: 100%;
  box-sizing: border-box;
  .el-menu-item {
  }
}
</style>