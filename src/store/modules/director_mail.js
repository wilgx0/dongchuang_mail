import types from '../types.js'
import {Toast, MessageBox, Indicator} from 'mint-ui'
import {getData} from '../../common.js'

const state ={
    director_mail_list:[],
    LastPage:0,     //总页数
    page:1			//当前页数
}

const getters = {
    director_mail_list(state){
        return state.director_mail_list
    },
}

const actions = {
    get_director_mail_list({commit,state}){
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
}

export default {
	state,
	getters,
	actions,
	mutations,
}
