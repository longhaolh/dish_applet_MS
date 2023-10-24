const getMenuTitle = (menuRouter) =>{
	let activeTitle = ''
	switch (menuRouter){
		case '1-1':
			activeTitle = "添加用户"
			break;
		case '1-2':
			activeTitle = "用户列表"
			break;
		case '1-3':
			activeTitle = "修改用户"
			break;
		default:
			break;
	}
	// console.log(menuRouter,activeTitle);
	return activeTitle
}
export default getMenuTitle