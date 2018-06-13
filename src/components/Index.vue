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
                        <li v-for="(item,index) in director_mail_list" class="page-loadmore-listitem"
                            @click="show_detail(index)">
                            <div class="item-content">
                                <p><span class="item-content-right">{{item.createtime|timestampToTime}}</span><strong>{{item.name}}：</strong>
                                </p>
                                <p>{{item.message|substring(40)}} <em v-if="item.message.length > 40">[查看全文]</em></p>
                                <template v-if="item.replycontent">
                                    <p><span
                                            class="item-content-right">{{item.replytime|timestampToTime}}</span><strong>局长回复：</strong>
                                    </p>
                                    <p>{{item.replycontent|substring(40)}}</p>
                                </template>
                            </div>
                        </li>
                    </ul>
                    <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'"
                              :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
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
                <template v-if="director_mail_list[detail_index] && director_mail_list[detail_index].replycontent">
                    <p>
                        <span class="item-content-right">{{(director_mail_list[detail_index]?director_mail_list[detail_index].replytime:'')|timestampToTime}}</span>
                        <strong>局长回复：</strong>
                    </p>
                    <p>{{director_mail_list[detail_index]?director_mail_list[detail_index].replycontent:''}}</p>
                </template>
            </div>

        </modal-dialog>

        <!--提交留言-->
        <modal-dialog ref="dialog_2" class="dialog_2" @dialogclose="clearForm">
            <div slot="heading">
                <h1 style="text-align:center;">
                    <span style="float:right;padding-right:10px;" @click="hide_msg">关闭</span>
                    向东川区公安局局长留言
                </h1>
            </div>

            <div class="dialog-content">
                <div class="page-part" style="margin-bottom:20px;">
                    <mt-field label="留言内容" placeholder="留言内容不少于20个字，请尽量叙述清晰，简明扼要"
                              type="textarea" rows="8" v-model='message' v-validate="'required|min:20'"
                              name="留言内容"></mt-field>
                </div>

                <div style="font-size:14px;color:#888;margin-bottom:5px;padding-left:5px;">
                    以下内容仅供工作人员查看，不对外公开
                </div>
                <div class="page-part">
                    <mt-field label="用户名" placeholder="请输入用户名" v-model='name' v-validate="'required|max:20'"
                              name="用户名"></mt-field>
                    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model='tel' v-validate="'required|phone'"
                              name="手机号"></mt-field>
                </div>
                <div style="margin-top:10px;text-align:center;">
                    <mt-button type="primary" style="width:80%;margin-bottom:10px;" @click="add_msg">提 交</mt-button>
                    <!--<mt-button type="default" style="width:80%;" @click="hide_msg">关 闭</mt-button>-->
                </div>
            </div>
            <div v-show="errors.any()" v-cloak :class='["error"]'>
                <p v-for="(v,i) in errors.all()">{{v}}</p>
            </div>
        </modal-dialog>


    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {timestampToTime, substring} from '../common.js'
    import ModalDialog from './dialog/dialog.vue'
    import {Toast, MessageBox, Indicator} from 'mint-ui'

    export default {
        data() {
            return {
                allLoaded: false,
                bottomStatus: '',
                wrapperHeight: 0,
                detail_index: 0,
                errorStyle: '',      //验证的错误提示样式
            };
        },
        computed: {
            ...mapGetters(['director_mail_list']),
            name: {
                set(value) {
                    this.$store.state.director_mail.name = value
                },
                get() {
                    return this.$store.state.director_mail.name
                }
            },
            tel: {
                set(value) {
                    this.$store.state.director_mail.tel = value
                },
                get() {
                    return this.$store.state.director_mail.tel
                }
            },
            message: {
                set(value) {
                    this.$store.state.director_mail.message = value
                },
                get() {
                    return this.$store.state.director_mail.message
                }
            },
        },
        filters: {
            substring: function (value, length) {
                return substring(value, length);
            },
            timestampToTime: function (value) {
                return timestampToTime(value);
            }

        },
        methods: {
            handleBottomChange(status) {            //组件底部状态发生变化时的回调函数
                this.bottomStatus = status;
            },
            loadBottom() {                          //加载更多数据
                this.$store.dispatch('loadMore_director_mail_list', this);
            },
            show_detail(index) {                          //显示留言的详情
                this.detail_index = index;
                this.$refs.dialog_1.open()
            },
            hide_detail() {                               //关闭留言的详情
                this.$refs.dialog_1.close()
            },
            show_msg() {                                 //显示留言提交界面
                this.$refs.dialog_2.open()
            },
            hide_msg() {                                 //隐藏留言提交界面
                this.$refs.dialog_2.close()
            },
            add_msg() {                                  //提交留言
                var _this = this;
                _this.$validator.validateAll().then((result) => {
                    if (result) {
                        Indicator.open();
                        _this.$store.dispatch('add_msg',function(){
                            Indicator.close();
                            _this.hide_msg();
                        })
                    }
                })

            },
            clearForm() {            //清空局长信箱的表单及错误提示
                var _this = this;
                _this.$store.dispatch('clear_form');
                setTimeout(function(){
                    _this.errors.clear();
                },300)

            },
        },
        created() {
            this.$store.dispatch('get_director_mail_list');
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        components: {
            ModalDialog,
        },
    };
</script>

<style lang='less'>

    .director-mail {
        .page-loadmore {
            margin-top: 40px;
            color: #2c3e50;
            .page-loadmore-wrapper {
                /*mt-loadmore控件的父级必须加此属性否则下拉的loadBottom事件不会生效 */
                overflow: scroll;
                .page-loadmore-list {
                    /*列表ul元素必须加一个最小高度（li的高度*li初始渲染数量）否则ajax获取数据时，会自动多次触发loadBottom事件，导致数据加载完毕*/
                    min-height: 900px;
                    .page-loadmore-listitem {
                        min-height: 90px;
                        border-bottom: solid 1px #eee;
                        text-align: center;
                        .item-content {
                            padding: 10px;
                            strong {
                                font-weight: bold;
                            }
                            & > p {
                                font-size: 14px;
                                line-height: 20px;
                                text-align: left;
                                word-wrap: break-word;
                                word-break: break-all;
                                overflow: hidden;
                                margin-bottom: 10px;
                                .item-content-right {
                                    float: right;
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
        .dialog_1 {
            color: #2c3e50;
            .item-content {
                height: 90%;
                overflow: scroll;
                padding: 10px;
                strong {
                    font-weight: bold;
                }
                & > p {
                    font-size: 14px;
                    line-height: 20px;
                    text-align: left;
                    word-wrap: break-word;
                    word-break: break-all;
                    margin-bottom: 10px;
                    .item-content-right {
                        float: right;
                    }
                }
            }
        }
        .dialog_2 {
            color: #2c3e50;
            .dialog {
                background-color: #f0f0f0;
                .dialog-body {
                    padding: 0px;
                    background-color: #f0f0f0;
                    overflow:hidden;

                }
            }

        }

        /*错误提示的样式*/
        .error {
            color: red;
        }
        .error > p {
            margin-top: 10px;
            text-align: center;
        }

    }

</style>
