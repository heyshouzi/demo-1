// pages/movies/more-movies/more-movies.js
var app = getApp();
var util = require("../../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies:{},
        isEmpty:true,
        isShowNavTitle:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var classify = options.classify;
        this.data.classify = classify;
        var dataUrl = "";
        switch (classify) {
            case '正在热映':
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
                break;
            case '即将上映':
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        util.http(dataUrl, this.precessDoubanData);


    },
    onScrollLower: function () {
        var totalCount = 20;
        this.data.totalCount = totalCount;
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.precessDoubanData);
        wx.showNavigationBarLoading({
          complete: (res) => {},
        })
    },
    precessDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverImgUrl: subject.images.large,
                movieId: subject.id,
            }
            movies.push(temp);
        }
        var totalMovies = [];
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
            // console.log(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.data.totalCount += 20;
        this.setData({
            movies:totalMovies
        });
        wx.hideNavigationBarLoading({
          complete: (res) => {},
        })
    },
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {
    wx.setNavigationBarTitle({
        title:  this.data.classify,
    })
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