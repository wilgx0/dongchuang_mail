<template>
    <div class="director-mail">
        <mt-header fixed title="东川110局长信箱">
            <div slot="right">
                <mt-button @click="show_msg">我要留言</mt-button>
            </div>
        </mt-header>

        <!--主要内容-->
        <div class="page-loadmore">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                             :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <li v-for="(item,index) in director_mail_list" class="page-loadmore-listitem" @click="show_detail(index)">
                            <div class="item-content">
                                <p><span class="item-content-right">{{item.createtime|timestampToTime}}</span><strong>{{item.name}}：</strong></p>
                                <p>{{item.message|substring(40)}} <em>[查看全文]</em></p>
                                <p><span class="item-content-right">{{item.replytime|timestampToTime}}</span><strong>局长回复：</strong></p>
                                <p>{{item.replycontent|substring(40)}}</p>
                            </div>
                        </li>
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

        <!--留言详情-->
        <modal-dialog ref="dialog_1" class="dialog_1">
            <div slot="heading">
                <h1 style="text-align:center;">
                    <span style="float:right;padding-right:10px;" @click="hide_detail">关闭</span>
                    留言详情
                </h1>
            </div>

            <div class="item-content">
                <p>
                    <span class="item-content-right">{{(director_mail_list[detail_index]?director_mail_list[detail_index].createtime:'')|timestampToTime}}</span>
                    <strong>{{director_mail_list[detail_index]?director_mail_list[detail_index].name:''}}：</strong>
                </p>
                <p>{{director_mail_list[detail_index]?director_mail_list[detail_index].message:''}}</p>
                <p>
                    <span class="item-content-right">{{(director_mail_list[detail_index]?director_mail_list[detail_index].replytime:'')|timestampToTime}}</span>
                    <strong>局长回复：</strong>
                </p>
                <p>{{director_mail_list[detail_index]?director_mail_list[detail_index].replycontent:''}}</p>
            </div>

        </modal-dialog>

        <!--提交留言-->
        <modal-dialog ref="dialog_2" class="dialog_2">
            <div slot="heading">
                <h1 style="text-align:center;">
                    <span style="float:right;padding-right:10px;" @click="hide_msg">关闭</span>
                    向东川区公安局局长留言
                </h1>
            </div>

            <div>
                <div class="page-part" style="margin-bottom:20px;">
                    <mt-field label="留言内容" placeholder="留言内容不少于20个字，请尽量叙述清晰，简明扼要"
                              type="textarea" rows="8"></mt-field>

                </div>

                <div style="font-size:14px;color:#888;margin-bottom:5px;padding-left:5px;">
                    以下内容仅供工作人员查看，不对外公开
                </div>
                <div class="page-part">
                    <mt-field label="用户名" placeholder="请输入用户名" :attr="{ maxlength: 10 }"></mt-field>
                    <mt-field label="手机号" placeholder="请输入手机号" type="tel"></mt-field>
                </div>
                <div style="margin-top:10px;text-align:center;">
                    <mt-button type="primary" style="width:80%;">提 交</mt-button>
                </div>

            </div>

        </modal-dialog>


    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {timestampToTime,substring} from '../common.js'
    import ModalDialog from './dialog/dialog.vue'

    export default {
        data() {
            return {
                allLoaded: false,
                bottomStatus: '',
                wrapperHeight: 0,
                detail_index:0,
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
            handleBottomChange(status) {            //组件底部状态发生变化时的回调函数
                this.bottomStatus = status;
            },
            loadBottom() {                          //加载更多数据
                this.$store.dispatch('loadMore_director_mail_list',this);
            },
            show_detail(index){                          //显示留言的详情
                this.detail_index = index;
                this.$refs.dialog_1.open()
            },
            hide_detail(){                               //关闭留言的详情
                this.$refs.dialog_1.close()
            },
            show_msg(){
                this.$refs.dialog_2.open()
            },
            hide_msg(){
                this.$refs.dialog_2.close()
            }
        },
        created() {
            this.$store.dispatch('get_director_mail_list');
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        components:{
            ModalDialog,
        },
    };
</script>

<style lang='less'>
    .director-mail {
        .page-loadmore {
            margin-top: 40px;
            color:#2c3e50;
            .page-loadmore-wrapper{
                /*mt-loadmore控件的父级必须加此属性否则下拉的loadBottom事件不会生效 */
                overflow: scroll;
                .page-loadmore-list {
                    /*列表ul元素必须加一个最小高度（li的高度*li初始渲染数量）否则ajax获取数据时，会自动多次触发loadBottom事件，导致数据加载完毕*/
                    min-height:1800px;
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
        .dialog_1{

            .item-content{
                height: 660px;
                overflow: scroll;
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
                    margin-bottom:10px;
                    .item-content-right{
                        float:right;
                    }
                }
            }
        }
        .dialog_2{
            .dialog{
                background-color:#f0f0f0;
                .dialog-body{
                    padding: 0px;
                    background-color:#f0f0f0;
                }
            }


        }
    }

</style>
