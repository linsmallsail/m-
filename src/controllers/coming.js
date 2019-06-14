const comingTpl = require('../views/coming.html')
const comingListTpl = require('../views/common/comingList.html')
const movieListTpl = require('../views/common/movieList.html')

const fetch = require('../models/fetch')
const BScroll = require('better-scroll').default

export default {
  render:async function() {
   
    $('#index-scroll').html(comingTpl)
    
    let dataList = await fetch.get('/api/ajax/mostExpected?ci=1&limit=10&offset=0&token=')
    let data = dataList.coming
    let renderedcomingListTpl = template.render(comingListTpl, { data })
    $('.swiper-wrapper').html(renderedcomingListTpl)

    let bscroll = new BScroll('#index-scroll', {
      probeType: 1,
      click: true
    })

    // var mySwiper = new Swiper ('.swiper-container', {
    //   slidesPerView: 'auto',
    //   spaceBetween: 10,
    //   direction: 'horizontal', // 水平切换选项
    // })
  
    let pageNum = 1
    let hasMore = true
    let bScroll = new BScroll('.swiper-container', {
      probeType: 2,
      scrollX: true,
      scrollY: false
    })
    bScroll.on('scrollEnd', async function() {
      if (this.x <= this.maxScrollX && hasMore) {
        let result = await fetch.get(`/api/ajax/mostExpected?ci=1&limit=10&offset=${++pageNum * 10}&token=`)
        hasMore = result.coming.length > 0
        data = [
          ...data,
          ...result.coming
        ]
      }
      let renderedcomingListTpl = template.render(comingListTpl, { data })
      $('.swiper-wrapper').append(renderedcomingListTpl)
          
    })
    
    let movieDateList = await fetch.get('/api/ajax/comingList?ci=1&token=&limit=10')
    console.log(movieDateList);
    
    let movieData = movieDateList.coming
    let renderedmovieDataTpl = template.render(movieListTpl, { movieData })
    $('.category').html(renderedmovieDataTpl)

    // let bScroll = new BScroll('#index-scroll', {
    //   probeType: 1,
    //   click: true
    // })
  }
}