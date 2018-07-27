import types from '../types.js'
import {Toast, MessageBox, Indicator} from 'mint-ui'
import {getData} from '../../common.js'


var formData = {
    name:'',            //留言人姓名
    tel:'',             //留言人电话
    message:'',         //留言内容
    captcha:'',         //验证码
}
const state ={
    director_mail_list:[],
    LastPage:0,     //总页数
    page:1,			//当前页数
    notice:'',
    site_info:{},
    ...formData,
}

const getters = {
    director_mail_list(state){
        return state.director_mail_list
    },
    site_info(state){
        return state.site_info
    }
}

const actions = {
    clear_form({commit,state}){
      Object.assign(state,formData);
    },
    add_msg({commit,state},callback=null){                        //添加留言数据
        let _this  = this;
        getData(_this._vm.$url + '/api/director/public/add_msg',{
            name:state.name,
            tel:state.tel,
            message:state.message,
            captcha:state.captcha
        },function(response){
            response = response.data;
            if(response.code == 1){     //提交成功
                Toast(response.msg);
                if(callback){
                    callback();
                }
            } else {                    //提交失败
                Indicator.close();
                Toast(response.msg);
            }
        });
    },
    get_director_mail_list({commit,state}){             //首次加载数据
        var _this = this;
        state.director_mail_list = [];
        state.LastPage = 0;     //总页数
        state.page = 1;			//当前页数

        getData(_this._vm.$url + '/api/director/public/get_director_mail_list',{
            page : state.page,
        },function(response){
            response = response.data;
            if(response.code == 1){
                commit(types.GET_DIRECTOR_MAIL_LIST,response.data);
            } else {
                Toast(response.msg);
            }
        });
    },
    get_notice({commit,state}){               //获取举报须知
        var _this = this;
        getData(_this._vm.$url + '/api/director/public/get_notice',{},function(response){
            //console.log(response);
            response = response.data;
            if(response.code == 1){
                commit(types.GET_NOTICE,response.msg);
            }

        });
    },
    get_site_info({commit,state}){                //获取站点的相关信息
        getData(this._vm.$url + '/api/director/public/get_site_info',{},response => {
            response = response.data;
            if(response.code == 1){
                commit(types.GET_SITE_INFO,response.msg);
            }

        });
    },
    loadMore_director_mail_list({commit,state},obj){		//加载更多数据
        var _this = this;
        ++ state.page;
        if(state.page <= state.LastPage){
            getData(_this._vm.$url + '/api/director/public/get_director_mail_list',{
                page : state.page,
            },function(response){
                obj.$refs.loadmore.onBottomLoaded();    //单次数据加载完毕
                response = response.data;
                if(response.code == 1){
                    commit(types.GET_DIRECTOR_MAIL_LIST,response.data);
                } else {
                    Toast(response.msg);
                }
            });
        } else {
            obj.allLoaded = true;			        //所有数据加载完毕
            obj.$refs.loadmore.onBottomLoaded();    //单次数据加载完毕
        }

    },
}

const mutations = {
    [types.GET_DIRECTOR_MAIL_LIST](state,data) {
        state.director_mail_list = state.director_mail_list.concat(data.data);
        state.LastPage = data.last_page;
    },
    [types.GET_NOTICE](state,data){
        state.notice = data;
    },
    [types.GET_SITE_INFO](state,data){
        state.site_info = data;
        console.log(state.site_info);
    }
}

export default {
	state,
	getters,
	actions,
	mutations,
}
