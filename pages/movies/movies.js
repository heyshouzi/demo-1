// pages/movies/movies.js
var app = getApp();
var util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTheaters:{},
        top250:{},
        comingSoon:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var inTheatersUrl = app.globalData.g_doubanBase+ "/v2/movie/in_theaters"+"?start=0&count=3";
        var comingSoonUrl = app.globalData.g_doubanBase+ "/v2/movie/coming_soon"+"?start=0&count=3";
        var top250Url = app.globalData.g_doubanBase+ "/v2/movie/top250"+"?start=0&count=3";
        this.getMoviesData(top250Url,"豆瓣Top250","top250");
        this.getMoviesData(inTheatersUrl,"正在热映","inTheaters");
        this.getMoviesData(comingSoonUrl,"即将上映","comingSoon");
    },
    getMoviesData:function(url,classify,settedKey){
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            success:res=>{
                that.precessdoubanData(res.data,classify,settedKey);
            },
            fail:err=>console.log("getMoviesData_err_is" + err),
          })
    },
    precessdoubanData:function(moviesDouban,classify,settedKey){
        var movies = [];
        for(var idx in moviesDouban.subjects){
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if(title.length >= 6){
                title = title.substring(0,6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverImgUrl: subject.images.large,
                movieId: subject.id,
            }
            movies.push(temp);
            var readyData ={};
            readyData[settedKey] = {
                movies: movies,
                classify:classify,
            };
            this.setData(readyData);
            
        }
    },
    onMoreTap:function(event){
        var classify = event.currentTarget.dataset.classify;
        wx.navigateTo({
          url: 'more-movies/more-movies?classify=' + classify,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})