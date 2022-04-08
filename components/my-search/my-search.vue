<template>
	<view class="my-search-container" :style="{'background-color':bgcolor}">
		<view class="my-search-box" :style="{'border-radius':radius+'px'}" @click="search">
			<!--使用uni-ui提供的图标组件-->
			<uni-icons type="search" size="17"></uni-icons>
            <text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		//接收父页面传递的参数
		props:{
			bgcolor:{
				type:String,
				default:'#C00000'
			},
			radius:{
				type:Number,
				default:18
			}
		},
		methods:{
			search(){				
				//调用父页面方法
				this.$emit('click');
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.my-search-container{
	height: 50px;
	//background-color: #c00000;
	display: flex;
	align-items: center;
	padding: 0 10px;
	.my-search-box{
		height:36px;
		background-color: #ffffff;
		//border-radius: 18px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		.placeholder{
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>
