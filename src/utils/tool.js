const getMenuTitle = (menuRouter) =>{
	let activeTitle = ''
	switch (menuRouter){
		case '1-1':
			activeTitle = "添加用户信息"
			break;
		case '1-2':
			activeTitle = "用户列表"
			break;
		case '1-3':
			activeTitle = "修改用户信息"
			break;
		case '2-1':
			activeTitle = "添加店铺信息"
			break;
		case '3-1':
			activeTitle = "添加类目信息"
			break;
		case '4-1':
			activeTitle = "添加商品信息"
			break;
		default:
			break;
	}
	return activeTitle
}
export default getMenuTitle