<template>
    <div class="director-mail">
        <mt-header fixed title="东川110局长信箱">
            <router-link to="/" slot="right">
                <mt-button>我要留言</mt-button>
            </router-link>
        </mt-header>

        <!--主要内容-->
        <div class="page-loadmore">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                             :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <!--<li v-for="item in director_mail_list" class="page-loadmore-listitem">-->
                            <!--<div class="item-content">-->
                                <!--<p><span class="item-content-right">{{item.createtime|timestampToTime}}</span><strong>{{item.name}}：</strong></p>-->
                                <!--<p>{{item.message|substring(40)}} <em>[查看全文]</em></p>-->
                                <!--<p><span class="item-content-right">{{item.replytime|timestampToTime}}</span><strong>局长回复：</strong></p>-->
                                <!--<p>{{item.replycontent|substring(40)}}</p>-->
                            <!--</div>-->
                        <!--</li>-->


                        <li v-for="item in director_mail_list" class="page-loadmore-listitem">
                            <div class="item-content">
                                <p><span class="item-content-right">11</span><strong>11：</strong></p>
                                <p>11 <em>[查看全文]</em></p>
                                <p><span class="item-content-right">11</span><strong>局长回复：</strong></p>
                                <p>11</p>
                            </div>
                        </li>

                        <!--<li v-for="item in list" class="page-loadmore-listitem">-->
                            <!--<div class="item-content">-->
                               <!--{{ item }}-->
                            <!--</div>-->
                        <!--</li>-->
                    </ul>
                    <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                      </span>
                    </div>
                </mt-loadmore>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {timestampToTime,substring} from '../common.js'

    export default {
        data() {
            return {
                list:[],

                allLoaded: false,
                bottomStatus: '',
                wrapperHeight: 0
            };
        },
        computed:{
            ...mapGetters(['director_mail_list']),
        },
        filters:{
            substring:function(value,length){
                return substring(value,length);
            },
            timestampToTime:function(value){
                return timestampToTime(value);
            }

        },
        methods: {
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom() {
                // setTimeout(() => {
                //     let lastValue = this.list[this.list.length - 1];
                //     if (lastValue < 40) {
                //         for (let i = 1; i <= 10; i++) {
                //             this.list.push(lastValue + i);
                //         }
                //     } else {
                //         this.allLoaded = true;               //所有数据加载完毕
                //     }
                //     this.$refs.loadmore.onBottomLoaded();    //单次数据加载完毕
                // }, 1500);

                console.log('test');
               // this.$store.dispatch('loadMore_director_mail_list',this);
            }
        },
        created() {
            for (let i = 1; i <= 10; i++) {
                this.list.push(i);
            }
            this.$store.dispatch('get_director_mail_list');
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
    };
</script>

<style lang='less'>
    .director-mail {
        .page-loadmore {
            margin-top: 40px;
            overflow: scroll;
            color:#2c3e50;
            .page-loadmore-list {
                .page-loadmore-listitem {
                    height: 180px;
                    line-height: 180px;
                    border-bottom: solid 1px #eee;
                    text-align: center;
                    .item-content{
                        padding: 10px;
                        strong{
                            font-weight:bold;
                        }
                        & > p {
                            font-size:14px;
                            line-height: 20px;
                            text-align: left;
                            word-wrap: break-word;
                            word-break: break-all;
                            overflow: hidden;
                            margin-bottom:10px;
                            .item-content-right{
                                float:right;
                            }
                        }
                    }
                }
            }

            .mint-loadmore-bottom {
                span {
                    display: inline-block;
                    transition: .2s linear;
                    vertical-align: middle;

                }
                .mint-spinner {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }

    }

</style>
