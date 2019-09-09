# ESUN_INNOVATION_2019

進入投資畫面(esun_innocation_2019.html)每個擁有投票代碼的投資者都有5票，每一票兩萬，一共十萬元．每個人都可以針對想要投資的隊伍投資想要的金額，並且在最終送出前都還可以調整投資比例．在投票的過程中，顯示畫面（dashboard.html)可以呈現即時的投票成果．

## 使用元件

1. Google SpreadSheet
2. Google Action Scripts
3. GCP VM free tier (不一定需要)
4. Github
5. Bootstrap 3.4.1
6. jQuery 3.4.1
7. Vue 2.6.10 (dev version)
8. popper.js

### 選項元件
1. .tw 網域
2. letsencrypt for SSL
3. Cloudfare CDN for wildcase subdomain SSL


### 架構說明

1. https://ntuaha.github.io/ESUN_INNOVATION_2019/esun_innovation_2019.html
主要是為了讓投資者輸入自己的代碼之後，呈現所有的隊伍資訊，並可以在上面點選想要投資的金額與調整，並在送出之後檢查，是否已經都把資金用完．如果沒有，則系統會自動再跳回投資頁面，讓投資者可以繼續投資

2. https://ntuaha.github.io/ESUN_INNOVATION_2019/dashboard.html
呈現目前取得投資資金前六名的隊伍，並呈現目前投資活動總資金與已經投入資金的