function alert (text) {
  alert_info.$data.show = true
  alert_info.$data.msg = text
  setTimeout(function () {
    alert_info.$data.show = false
  }, 5000)
}

const TOTAL_SHARE = 5
const TOKEN = 'AKfycbwDa6PUTNCnVmEczUBGEOl_y04pEbweL0VndRXj'
let USER_ID = ''

// https://www.tangshuang.net/3507.html
// https://dwatow.github.io/2018/09-21-vuejs/vue-component-with-v-model/
Vue.component('step1', {
  model: {
    prop: 'user_id',
    event: 'input'
  },
  props: {
    show: Boolean,
    input_placeholder: String,
    user_id: String,
    banner_src: String
  },
  methods: {
    check: function (user_id) {
      var _this = this
      console.log(user_id)
      if (user_id) {
        let url = `https://script.google.com/macros/s/${TOKEN}/exec?type=checkuser&user_id=${user_id}`
        fetch(url)
          .then(function (response) {
            return response.json()
          })
          .then(function (r) {
            if (r.status == 200) {
              if (r.vote) {     
                // 已經有投票資訊
                step1.$data.show = false
                step2.$data.show = true
                step2.$data.items = r.data
                  .filter(function (item) {
                    return !!item[0]
                  })
                  .map(function (item) {
                    return {
                      title: item[2],
                      content: item[3],
                      vote_id: item[0],
                      user_id: user_id,
                      img_src: item[1],
                      img_show: !!item[1],
                      show: true,
                      choose: false,
                      temp_share:0,
                      permanent_share:0
                    }
                  })
                for(var i in r.vote){
                  for(var j in vote_data.items){
                    if(vote_data.items[j].vote_id==r.vote[i]){
                      vote_data.items[j].permanent_share += 1;
                      vote_data.total_share += 1;
                    }
                  }
                } 
                
              } else {
                // 成功驗證身份

                step1.$data.show = false
                step2.$data.show = true
                step2.$data.items = r.data
                  .filter(function (item) {
                    return !!item[0]
                  })
                  .map(function (item) {
                    return {
                      title: item[2],
                      content: item[3],
                      vote_id: item[0],
                      user_id: user_id,
                      img_src: item[1],
                      img_show: !!item[1],
                      show: true,
                      choose: false,
                      temp_share:0,
                      permanent_share:0
                    }
                  })
              }
            } else if (r.status == 404) {
              console.log(_this.$data, '404')
              step1.$data.user_id = ''
              _this.$refs.input.focus()
              alert('此代碼無效')
            }
          })
      } else {
        step1.$data.input_placeholder = '請輸入閃電講投票編號'
      }
    }
  },
  // https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
  // ref:  https://blog.johnsonlu.org/vue-refs/
  template: `
    <div class="row" id="step1_input" v-if="show">
      <div class="text-center col-12">
          <img class="img-fluid img_width" :src="banner_src">
          <div class="col-12">接下來就是殘酷的選擇時間拉</div>
          <div class="col-12"> 請在下方填入您的投資人編號</div>
      </div>   
      <div class="text-center col-12">     
          <input class = "col-12  form-control" ref="input" type="text" id="user_id" :value='user_id' @input="$emit('input', $event.target.value)" :placeholder="input_placeholder" >
          <div class='w-100'></div>
          <button class = "col-12   btn btn-success btn-lg btn-block" v-on:keyup.13="check(user_id)" @click.once = "check(user_id)" v-if="(user_id)?true:false"> 送出 </button>                
      </div>
    </div>
    `
})

var step1 = new Vue({
  el: 'step1',
  data: {
    show: true,
    input_placeholder: '請輸入你的投資人編號',
    user_id: '',
    banner_src: 'banner.jpg'
  }
})

Vue.component('alert-info', {
  props: ['show', 'msg'],
  template: `
    <div role="alert" class="alert alert-danger alert-dismissible fade show margin" v-if="show">{{msg}}</div>
    `
})

var alert_info = new Vue({
  el: 'alert-info',
  data: {
    show: true,
    msg: ''
  }
})






Vue.component('card', {
  props: {
    item: Object,
    vote_status: Boolean
  },
  methods: {
    put: function (item) {
      console.log('put click', item.vote_id)   
            
      if (vote_data.total_share == TOTAL_SHARE) {        
        console.log("you cannot add any more")
        checkChooseList()
        return;
      }
      
      let target_i = -1
      //找到要增加的item
      for (let i in vote_data.items) {
        let ii = vote_data.items[i]        
        if (ii.vote_id == item.vote_id) {          
          target_i = i
        }
        //current_counter = current_counter + ii.permanent_share+ii.temp_share
      }

      
      vote_data.items[target_i].temp_share += 1;
      vote_data.total_share += 1;
      checkChooseList()

    },
    call: function (item) {
      console.log('call click', item.vote_id)
      for (var i in vote_data.items) {
        var ii = vote_data.items[i]
        if (ii.vote_id == item.vote_id) {          
          target_i = i
        }
      }
      if (vote_data.items[target_i].temp_share == 0) {        
        console.log("you call any more")
        checkChooseList()
        return;
      }
      
      
      vote_data.items[target_i].temp_share -= 1;
      vote_data.total_share -= 1;


      checkChooseList()
    }
  },
  template: `
    <div class="card" v-if="item.show">
        <img class="card-img-top" :src="item.img_src" :alt="item.title" v-if="item.img_show">
        <div class="card-body">
          <h5 class="card-title">{{item.title}}</h5>
          <p class="card-text">{{item.content}}</p>
          <button class="btn btn-success" v-if='vote_status' @click="put(item)"> 加碼投資 </button>
          <button class="btn btn-danger" v-if='vote_status' @click="call(item)"> 回收投資 </button>
          <p class="card-text" v-if='(item.permanent_share+item.temp_share)>0'> 目前已投資 {{(item.permanent_share+item.temp_share)*2}} 萬</p>
        </div>
    </div>
`
})

Vue.component('step2-nav', {
  props: {
    show: Boolean,
    choose: Array,
    items: Array,
    total_share : Number,
    title: {
      type: String,
      default: 'QQ'
    }
  },
  data: () => {
    return {
      status: this.title
    }
  },
  watch: {
    items: {
      deep: true,
      handler: function (newValue, oldValue) {
        /*
        var counter = 0
        newValue.forEach(function (i) {
          if (i.choose) {
            counter++
          }
        })
        vote_data.counter = counter
        */
        // console.log('watch', counter)
        if (vote_data.total_share > 0) {
          this.status = `已經投資 ${vote_data.total_share*2} 萬元`
        } else {
          this.status = `再慢慢選擇喔`
        }
      }
    }
  },
  template: `
      <nav class="navbar navbar-dark bg-dark fixed-top" v-if="show">
      <div class='container'>
        <a class='navbar-brand' href='#' >
          {{status}}
        </a>
      </div>
      </nav>
  `
})

Vue.component('step2-footer', {
  props: {
    show: Boolean,
    choose: Array,
    items: Array,
    total_share : Number
  },
  data: () => {
    return {
      ready: false,
      list: '目前空空的喔'
    }
  },
  watch: {
    items: {
      deep: true,
      handler: function (newValue, oldValue) {
        var temp_counter = 0
        var title = []
        this.ready = false

        newValue.forEach(function (i) {          
          if ((i.permanent_share+i.temp_share)>0){            
            title.push(`${i.title} x ${i.permanent_share+i.temp_share}`)
            temp_counter += i.temp_share
            
          }
        })
        
        this.list = title.join(' ||| ')
        if(temp_counter>0){
          this.ready = true          
        }else{
          this.ready = false
        }
        //console.log('list',this.list)
        // 判斷是否可以上傳投票        
        /*
        if (vote_data.total_share == TOTAL_SHARE) {
          this.ready = true
        } else {
          this.ready = false
        }
        */
      }
    }
  },
  methods: {
    update: function () {
      mc.$data.content = getShareDescriptionVue()
      
      mc.$data.title = '新增'
      vote_data.items.forEach(i => {
        if (i.permanent_share>0){
          mc.$data.title = "追加"
        }        
      })
      $('#myModal').modal('show')
    }
  },
  template: `
      <nav class="navbar navbar-dark bg-dark fixed-bottom" v-if="show">
      <div class='container'>
        <div class='brand'>{{list}}</div>
        
        <form class='form-inline'>
        <button class='btn btn-outline-success' type='button' @click=update() v-if="ready">
          投票去
        </button>
      </form>

      </div>
      
      </nav>
  `
})

Vue.component('step2', {
  props: {
    show: Boolean,
    items: Array,
    vote_status: Boolean,
    choose: Array
  },
  // https://vuejs.org/v2/guide/components-props.html
  template: `            
            <div class="row" id="step2_vote_list" v-if='show'>
                <div class="card-columns margin" id="card-columns">
                <card v-for="item in items" :item="item" :key="item.vote_id" :vote_status='vote_status' ></card>
                </div>
            </div>            
    `
})

//每一個被投票選擇
var vote_data = {
  show: true,
  vote_status: true,
  choose: [],
  counter: 0,
  total_share: 0,
  items: [
    {
      title: '124',
      content: 'qqqq',
      vote_id: 1,
      user_id: 'A1',
      img_src:
        'https://www.penghu-nsa.gov.tw/FileDownload/Album/Big/20161012162551758864338.jpg',
      img_show: true,
      show: true,
      choose: false,
      temp_share: 0,
      permanent_share: 0
    }
  ]
}



var step2 = new Vue({
  el: 'step2',
  data: vote_data
})

var step2_nav = new Vue({
  el: 'step2-nav',
  data: vote_data
})

var step2_footer = new Vue({
  el: 'step2-footer',
  data: vote_data
})

Vue.component('thankyou', {
  props: {
    show: Boolean,
    info: String
  },
  template: `<div class="row" id="info_1" v-if="show">
                <div class="col-12">
                    <h6 v-html="info"></h6>
                </div>
            </div>
    `
})

var thankyou = new Vue({
  el: 'thankyou',
  data: {
    show: false,
    info: ''
  }
})

Vue.component('modal-content', {
  props: {
    title: String,
    content:Array
  },
  template: `<div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title">投給 {{title}}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                          <p>確定之後就不能反悔了喔</p><p v-for="c in content" :key="c.id" >{{c.text}}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">我再想想</button>
                            <button type="button" id="modal_btn" class="btn btn-primary">投了</button>
                        </div>
                    </div>
                </div>
    `
})

var mc = new Vue({
  el: 'modal-content',
  data: {
    title: '',
    content: []
  }
})

$(function () {
  step2.$data.show = false
  alert_info.$data.show = false

  $('#myModal').modal({
    keyboard: false,
    show: false
  })

  $('#modal_btn').click(function () {
    var vote_ids = []    
    var user_id = vote_data.items[0].user_id


    //建立投票清單
    vote_ids = getShareList().join(',')
    vote_data.show = false
    thankyou.$data.show = true
    thankyou.$data.info = '<div>投票進行中...</div>'        
    

    $('#myModal').modal('hide')
    var url = `https://script.google.com/macros/s/${TOKEN}/exec?type=vote&user_id=${user_id}&vote=${vote_ids}`
    fetch(url)
      .then(function (response) {
        return response.json()
      })
      .then(function (myJson) {
        console.log(myJson)      
        if(myJson.msg.length==TOTAL_SHARE){
          thankyou.$data.info = `<div>投票完成囉</div><div>${getShareDescription()}</div>`
        }else if(myJson.msg=="慢了一步，停止投票囉"){
          thankyou.$data.info = `<div>慢了一步，停止投票囉</div>`
        }else{
          thankyou.$data.info = `<div>部分投票完成囉</div><div>${getShareDescription()}</div>，再過3秒後回到投票系統`
          setTimeout(function(){
            initialize(user_id)
          },3000)          
        }        
      })
  })
})
