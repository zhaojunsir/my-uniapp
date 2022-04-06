<template>
	<view>
		<!--scroll容器方便布局-->
		<view class="scroll-view-container">
			<!--左侧滑动区-->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh+'px'}">
				<block v-for="(cate,index) in cateList" :key="index">
					<view :class="['left-scroll-view-item',index===active?'active':'']" @click="change(index)">
						{{cate.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!--右侧滑动区-->
			<scroll-view scroll-y="true" :style="{height: wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in catLevel2" :key="i2">
					<!--二级分类结构-->
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<!--三级分类列表数据-->
					<view class="cate-lv3-list">
						<view class="cat-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="toGoodsList(item3)">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//可用窗口高度
				wh: 0,
				//分类列表数据
				cateList: [],
				//默认激活项
				active: 0,
				//二级分类
				catLevel2: [],
				//滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		onLoad: function() {
			this.wh = uni.getSystemInfoSync().windowHeight;
			this.getCateList();
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/categories");
				if (res.meta.status !== 200) {
					return uni.$showMsg();
				} else {
					this.cateList = res.message;
					this.catLevel2 = res.message[0].children;
				}
			},
			change(index) {
				this.active = index;
				this.catLevel2 = this.cateList[index].children;
				//因为赋值为0的话，没有变化，滚动条是不会变化的
				this.scrollTop = this.scrollTop === 0 ? 0.5 : 0;
			},
			//点击三级分类后跳转到商品列表页面
			toGoodsList(item3){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid='+item3.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				background-color: #f7f7f7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #ffffff;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						//子absolute，父必须relative
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}

		}
	}

	//二级分类样式
	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		/*自动换行*/
		flex-wrap: wrap;

		.cat-lv3-item {
			width: 33.3%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
