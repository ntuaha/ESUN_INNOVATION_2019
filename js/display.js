var data = {
    status:[],
    info:[]
}

const TOKEN = 'AKfycbwDa6PUTNCnVmEczUBGEOl_y04pEbweL0VndRXj'

Vue.component('vote_status', {
    props: {
      status: Array
    },
    // https://vuejs.org/v2/guide/components-props.html
    template: `            
              <div class="row">
                <table class="table table-dark table-striped">
                <thead>
                    <tr>
                    <th scope="col">隊伍</th>                    
                    <th scope="col">獲得投資資金</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in status" :key="c.key">
                        <td>{{c.team_name}}</td>
                        <td>{{c.votes*2}}萬</td>
                    </tr>
                </tbody>
                </table>              
            </div>            
      `
  })

  var status_table = new Vue({
    el: 'vote_status',
    data: data
  })

  Vue.component('info_status', {
    props: {
      info: Array
    },
    // https://vuejs.org/v2/guide/components-props.html
    template: `            
              <div class="row">
                <table class="table table-dark">
                <thead>
                    <tr>
                    <th scope="col">總資金池</th>		
                    <th scope="col">已經完成投入資金</th>
                    <th scope="col">閒置資金</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <th scope="row">{{info[0][0]*2}}萬</th>
                        <td>{{info[0][1]*2}}萬</td>
                        <td>{{info[0][2]*2}}萬</td>
                    </tr>
                </tbody>
                </table>              
            </div>            
      `
  })









  var info_table = new Vue({
    el: 'info_status',
    data: data
  })


function check(){
    let url = `https://script.google.com/macros/s/${TOKEN}/exec?type=checkCurrentStatus`
    fetch(url)
        .then(function (response) {
        return response.json()
        })
        .then(function (r) {
            console.log(r)
            data.status = []      
            var counter = 1  
            r.stats.sort(function(a,b){
                return b[0]-a[0]
            });     
            r.stats.forEach(element => {
                if(counter<=6){
                    data.status.push({
                        key:counter,
                        votes:element[0],
                        team_name:element[1]
                    })
                }                
                counter++;
            });
            data.info = r.vote_status

        })
    setTimeout(function(){
        check()
    },2000)
    console.log(new Date())
}




  $(function(){
    check()    
  })
