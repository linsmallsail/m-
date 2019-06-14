const fetch = require('../models/fetch')
const movieListTpl = require('../views/common/movieList.html')
const hotTpl = require('../views/hot.html')
const BScroll = require('better-scroll').default
const _ = require('lodash')

let positionList = []

const render = async () => {

  $('#index-scroll').html(hotTpl)
  let dataList = await fetch.get('/api/ajax/movieOnInfoList?token=')
  let movieData = dataList.movieList
   
  let renderedmovieListTpl = template.render(movieListTpl, { movieData })
  $('#seeMovies').html(renderedmovieListTpl)


  // Better scroll 实例化
  let bScroll = new BScroll('#index-scroll', {
    probeType: 1,
    click: true
  })

  let head = $('.head img'),
    topImgHasClass = head.hasClass('up')
  let foot = $('.foot img'),
    bottomImgHasClass = head.hasClass('down')

  // 初始化位置
  bScroll.scrollTo(0, -40)

  // 绑定滑动事件
  bScroll.on('scroll', function () {
    let y = this.y
    let maxY = this.maxScrollY - y

    // 下拉，当隐藏的loading完全显示的时候触发
    if (y >= 0) {
      !topImgHasClass && head.addClass('up')
      return
    }

    // 上拉，当滚动到最底部时候触发
    if ( maxY >=0 ) {
      !bottomImgHasClass && foot.addClass('down')
      return
    }
  })

  // 绑定手指松开触发的事件
  bScroll.on('scrollEnd', _.debounce(async function() {
    // 上拉刷新处理
    if (this.y >= -40 && this.y < 0) {
      this.scrollTo(0, -40)
      head.removeClass('up')
    } else if (this.y >= 0) {
      head.attr('src', '/images/ajax-loader.gif')

      // 异步加载数据
      let result = await fetch.get(`/api/ajax/movieOnInfoList?token=`)
      let movieData = positionList = result.movieList

      let renderedmovieListTpl = template.render(movieListTpl, { movieData })
      $('#seeMovies').html(renderedmovieListTpl)

      this.refresh() // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scrollTo(0, -40)
      head.removeClass('up')
      head.attr('src', '/images/arrow.png')
    }

    // 下拉加载处理
    let maxY = this.maxScrollY - this.y
    if (maxY > -40 && maxY < 0) {
        this.scrollTo(0, this.maxScrollY + 40);
        foot.removeClass('down')
    } else if (maxY >= 0) {
      foot.attr('src', '/images/ajax-loader.gif')
      // 异步加载数据
      let result = await fetch.get(`/api/ajax/moreComingList?token=&movieIds=887623,1196188,1226516,346629,1184910,1278409,1220829,1225975,1254277,1218727`)
      let movieData = positionList = [ ...positionList, ...result.coming ]

      let renderedmovieListTpl = template.render(movieListTpl, { movieData })
      $('#seeMovies').html(renderedmovieListTpl)

      this.refresh() // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scrollTo(0, this.maxScrollY + 40)
      head.removeClass('down')
      head.attr('src', '/images/arrow.png')
    }
  }))


}
export default {
  render
}