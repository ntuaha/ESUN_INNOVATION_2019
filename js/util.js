function checkChooseList(){
    // for debug
    var choose_list = []
    vote_data.items.forEach(item => {
        for(let i = 0 ;i <item.permanent_share;i++){
            choose_list.push(item.vote_id)
        }
        for(let i = 0 ;i <item.temp_share;i++){
            choose_list.push(item.vote_id)
        }                    
    })
    console.log('choose_list', choose_list)
}


function getShareList(){
    // for debug
    var choose_list = []
    vote_data.items.forEach(item => {
        for(let i = 0 ;i <item.permanent_share;i++){
            choose_list.push(item.vote_id)
        }
        for(let i = 0 ;i <item.temp_share;i++){
            choose_list.push(item.vote_id)
        }                    
    })
    return choose_list;
}


function getShareDescription(){
    var permanent_counter = 0;
    var ans = ''
    vote_data.items.forEach(i => {
        permanent_counter += i.permanent_share        
    })
    ans = ''
    // 已經有投資的說明?    
    if(permanent_counter>0){
        ans += `<div>你已經投資了 ${permanent_counter*2} 萬元，分別是</div>` 
        vote_data.items.forEach(i => {
            if (i.permanent_share>0) {
                ans += `<div>${i.title} 有 ${i.permanent_share*2} 萬元</div>`
            }
        })    
    }
    
    // 新增的說明
    ans += `<div>這次</div>`
    vote_data.items.forEach(i => {
        if (i.temp_share>0) {
            ans += `<div>${i.title} 新增 ${i.temp_share*2} 萬元</div>`
        }
    }) 
    return ans
}


function getShareDescriptionVue(){
    var permanent_counter = 0;
    var ans = []
    var counter = 0;
    vote_data.items.forEach(i => {
        permanent_counter += i.permanent_share        
    })    
    // 已經有投資的說明?    
    if(permanent_counter>0){
        ans.push({"id":counter,"text":`你已經投資了 ${permanent_counter*2} 萬元，分別是`})
        counter++

        vote_data.items.forEach(i => {
            if (i.permanent_share>0) {
                ans.push({"id":counter,"text":`${i.title} 有 ${i.permanent_share*2} 萬元`})
                counter ++
            }
        })    
    }
    
    // 新增的說明
    ans.push({"id":counter,"text":`這次`})
    counter++    
    vote_data.items.forEach(i => {
        if (i.temp_share>0) {
            ans.push({"id":counter,"text":`${i.title} 新增 ${i.temp_share*2} 萬元`})
            counter++    
        }
    }) 
    return ans
}

function initialize(user_id){
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
                    vote_data.total_share = 0
                    for(var i in r.vote){
                        for(var j in vote_data.items){
                            if(vote_data.items[j].vote_id==r.vote[i]){
                                vote_data.items[j].permanent_share += 1;
                                vote_data.total_share += 1;
                            }
                        }
                    } 
                }
            }
        })
}