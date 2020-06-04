// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayMusic: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var postId = options.Id;
        var globalData = app.globalData;
        var that = this;
        //传值给onCollectTap函数
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData
        });

        var postsCollected = wx.getStorageSync('posts_Collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_Collected', postsCollected);
        }
        if(app.globalData.g_isPlayMusic&& app.g_currentPlayMusicPostId == postId){
            this.setData({isPlayMusic:true});
        }
        wx.onBackgroundAudioPause(function(){
                that.setData({isPlayMusic:false});
        })
        wx.onBackgroundAudioPlay(function(){
            that.setData({isPlayMusic:true});
        })
        wx.onBackgroundAudioStop(function(){
            that.setData({isPlayMusic:false});
        })
    },
    // 
    onColletionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_Collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏变成未收藏， 未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postCollected, postsCollected);
    },
    showModal: function (postCollected, postsCollected) {
        var that = this;
        wx.showModal({
            title: '收藏',
            content: postCollected ? '您确定要收藏这篇文章吗？' : '您确定取消收藏这篇文章吗？',
            cancelColor: 'cancelColor',
            success: (res) => {
                if (res.comfirm) {
                    //更新本地储藏的'posts_Collected'
                    wx.setStorageSync('posts_Collected', postsCollected);
                    //更新数据绑定
                    that.setData({
                        collected: postCollected
                    });
                } else {

                }
            }
        })
    },
    showToast: function (postCollected, postsCollected) {
        //更新本地储藏的'posts_Collected'
        wx.setStorageSync('posts_Collected', postsCollected);
        //更新数据绑定
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected? '收藏成功' : '取消成功',
            icon:'success',
            duration:1000
        })
    },





    //定义分享
    onShareTap: function () {
        var itemList = [
            '分享给微信好友',
            '分享到朋友圈',
            '分享到QQ空间',
            '分享到微博'
        ];
        wx.showActionSheet({
            itemList: itemList,
            complete: (res) => {},
            fail: (res) => {
                console.log(' as failed')
            },
            itemColor: '#405f80',
            success: (result) => {
                wx.showModal({
                    title: "你将" + itemList[result.tapIndex],
                    content: '目前还无法分享，因为小程序还没有把这个功能给做出来。'
                })
            },
        })

    },
    //播放音乐和暂停音乐
    onmusictap:function(){
        var isPlayMusic = this.data.isPlayMusic;
        var postId = this.data.currentPostId;
        
        if(isPlayMusic){
            wx.stopBackgroundAudio({
              complete: (res) => {},
            });
            app.globalData.g_isPlayMusic = false;
            app.g_currentPlayMusicPostId = null;
            this.setData({isPlayMusic:false});
        }
        else{
            wx.playBackgroundAudio({
              dataUrl: postsData.postList[postId].music.url,
              title: postsData.postList[postId].music.title,
              coverImgUrl: postsData.postList[postId].music.coverImg,
            })
            app.globalData.g_isPlayMusic = true;
            app.g_currentPlayMusicPostId = postId;
            this.setData({isPlayMusic:true});
        }
    },

})