<template>
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!--分类导航-->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!--楼层区域-->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!--楼层标题-->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!--楼层图片区域-->
				<view class="floor-img-box">
					<!--左侧大图片-->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
					</navigator>
					<!--右侧四张图片-->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(product,index) in item.product_list" :key="index"
							v-if="index!==0" :url="product.url">
							<image :src="product.image_src" :style="{width:product.image_width+'rpx'}" mode="widthFix">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//声明轮播图数组
				swiperList: [],
				//分类导航数组
				navList: [],
				//楼层数据
				floorList: []
			};
		},
		onLoad: function() {
			//加载轮播图数据
			this.getSwiperList();
			//加载导航数据
			this.getNavList();
			//加载楼层数据
			this.getFloorList();
		},
		methods: {
			//获取轮播图数据方法
			async getSwiperList() {
				//发起请求
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/home/swiperdata");
				//请求成功
				if (res.meta.status === 200) {
					this.swiperList = res.message;
				} else { //请求失败
					return uni.$showMsg();
				}

			},
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/home/catitems");
				if (res.meta.status !== 200) {
					return uni.$showMsg();
				} else {
					this.navList = res.message;
				}
			},
			navClickHandler: function(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: "/pages/cate/cate"
					})
				}
			},
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/home/floordata");
				if (res.meta.status !== 200) {
					return uni.$showMsg();
				}
				//对楼层图片的navigator_url进行处理
				res.message.forEach(floor=>{
					floor.product_list.forEach(prod=>{
						prod.url = '/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
					})
				});
				this.floorList = res.message;
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			height: 100%;
			width: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;			
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
	}
	
	.right-img-box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	/*左侧大图片和右侧四张小图片水平布局*/
	.floor-img-box{
		display: flex;
		padding-left: 10rpx;
	}
</style>
