<template>
	<view>
		<view class="search-box">
			<!-- 基本用法 -->
			<uni-search-bar focus="true" placeholder="请输入查询内容" @confirm="search" @input="input" radius="100"
				cancelButton="none"></uni-search-bar>
		</view>
		<!--搜索建议列表-->
		<view class="sugg-list" v-if="searchResults.length!=0">
			<view class="sugg-item" v-for="(item,index) in searchResults" :key="index"
				@click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!--搜索历史区-->
		<view class="history-box" v-else>
			<!--标题区-->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clear"></uni-icons>
			</view>
			<!--标签区-->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,index) in histories" :key="index" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//防抖处理使用的定时器
				timer: null,
				//搜索关键字
				kw: '',
				//结果列表数组
				searchResults: [],
				//历史结果数组
				historyList: []
			};
		},
		computed:{
			//页面显示的历史结果数据
			histories(){
				//基于原数组复制得到一个新数组
				return [...this.historyList].reverse()
			}
		},
		methods: {
			//input输入事件处理
			input(res) {
				//用户连续输入，需要清理前面的定时器
				clearTimeout(this.timer)
				//500毫秒后，输出用户的值
				this.timer = setTimeout(() => {
					this.kw = res;
					this.getSearchList();
					//保存搜索历史
					this.saveSearchHistory();

				}, 500)
			},
			async getSearchList() {
				if (this.kw.length === 0) {
					this.searchResults = []
					return;
				} else {
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/goods/qsearch', {
						query: this.kw
					});
					if (res.meta.status === 200) {
						this.searchResults = res.message;
					} else {
						return uni.$showMessage();
					}
				}
			},
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			saveSearchHistory(){
				this.historyList.push(this.kw);
				const set = new Set(this.historyList);
				//先删除了，然后再添加，保证最后输入的在前面
				set.delete(this.kw);
				set.add(this.kw);
				this.historyList = Array.from(set);
				//持久化到本地
				uni.setStorageSync('kw',JSON.stringify(this.historyList));
			},
			clear(){
				this.historyList = [];
				uni.removeStorageSync('kw');
			},
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+kw
				})
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]');
		}
	}
</script>

<style lang="scss">
	/*search-bar的背景色*/
	.uni-searchbar {
		background-color: #c00000;
	}

	/*吸顶效果*/
	.search-box {
		position: sticky;
		top: 0px;
		z-index: 999;
	}

	/*建议列表*/
	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			;

			.goods-name {
				//文字不允许换行
				white-space: nowrap;
				//溢出部分隐藏
				overflow: hidden;
				//溢出文字使用...代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;
		.history-title {
			display: flex;
			//两边占满
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
