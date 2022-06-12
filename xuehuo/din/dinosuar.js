G.F.loadMain = function(){

    window.alert("手机用户在手机设置中打开自动旋转屏幕即可横屏体验游戏");

    this.AI = G.F.mainAI;

    G.KB.addKeys("UP","F");

    G.setState({barrierInterval:150,
          speed:6,
          jumpSpeed:10,
          jumpmax:100,
           baseInterval:10,
           on:0,
           w:500,
           h:300
        });

    G.makeGob('viewport',G)
        .setVar({x:50, y:50, w:G.S.w, h: G.S.h})
        .setStyle({backgroundColor:"#EEEEEE",border:"dashed"})
        .turnOn();

    G.makeGob('bullet',G.O.viewport)
    .setVar({x:50,y:320,w:15,h:5,AI:G.F.bulletAI})
    .setStyle({backgroundColor:"#FFFFFF"})
    .setState({firing:0})
    .turnOff();

    G.makeGob('dinosuar',G.O.viewport,"IMG")
        .setVar({x:50, y:G.S.h-80, w:40, h:50,AI:G.F.dinosuarAI})
        .setStyle({margin:0})
        .setSrc("dinosuar.bmp")
        .setState({jump:0, down:0,protection:0})
        .turnOn();
    
    G.makeGob('floor',G.O.viewport)
        .setVar({x:0, y:G.S.h-30, h:5, w:500})
        .setStyle({backgroundColor:"#000000",border:'dashed'})
        .turnOn();
    
    G.makeGob('rightClick',G.O.viewport)
        .setVar({x:0,y:0,w:G.S.w/3,h:400,AI:G.F.rightClickAI})
        .turnOn();

    G.makeGob("leftClick",G.O.viewport)
        .setVar({x:G.S.w*2/3,y:0,w:G.S.w/3,h:400,AI:G.F.leftClickAI})
        .turnOn();

    //define a class to handle barriers
    G.O.Barriers = {
        count: 0,
        idCount: 0,
        barrierheight:20,
        barrierList: [],
        makeBarrier: G.F.makeBarrier,
        AI:G.F.BarriersAI
    }
    
    G.makeGob('scoreBoard',G.O.viewport)
        .setVar({x:50, y:0,w:200,h:60,AI:G.F.scoreBoardAI})
        .setSrc('SCORE:')
        .setState({msg:"SCORE:",score:0})
        .setStyle({color:"#000000"})
        .turnOn()
    
    G.makeGob('target',G.O.viewport,"IMG")
        .setVar({x:G.S.w*5/6,y:G.S.jumpmax,w:20,h:60,AI:G.F.targetAI})
        .setSrc('target.png')
        .turnOn();
    G.makeGob("shelter",G.O.viewport)
        .setVar({x:-100, y:G.S.h-150, w:40, h:50,AI:G.F.shelterAI})
        .setState({on:0})
        .setStyle({margin:0,border:"dashed"})
        .turnOn();
    G.makeGob('startButton',G.O.viewport)
        .setVar({x:G.S.w/3,y:G.S.h/3,w:G.S.w/3,h:G.S.h/6,AI:G.F.startButtonAI})
        .setStyle({backgroundColor:'#000000',color:'#FFFFFF', textAlign:'center',fontSize:"2em",paddingTop:"5%"})
        .setSrc('START')
        .turnOn();
}
G.F.mainAI = function(){
        G.O.startButton.AI();
    if (G.S.on){
        //move dinosuar
        G.O.dinosuar.AI();
        //check mouse click
        G.O.rightClick.AI();
        G.O.leftClick.AI();
        //renew the score
        G.O.scoreBoard.AI();
        //run barriers class
        G.O.Barriers.AI();
        //move bullet
        G.O.bullet.AI();
        //chcek target
        G.O.target.AI();
        //move shelter
        G.O.shelter.AI();

    }
}
G.F.dinosuarAI = function(){
    // console.log(this.y);
    var t = this;

    //turn on jump mod if UP pessed
    if(G.KB.keys.UP.isPressed && !t.S.jump && !t.S.down) {
        t.S.jump = 1;
        
    }

    //jump if in jump mod
    if(t.S.jump) {
        if (t.y > G.S.jumpmax) {
            t.setVar({y:t.y-G.S.jumpSpeed}).draw();
        }
        else {
            t.S.down = 1;
            t.S.jump = 0;
        }
    }

    //go down if in down mod
    if(t.S.down) {
        if(t.y < G.O.floor.y-t.h) 
        {
            t.setVar({y:t.y+G.S.jumpSpeed}).draw();
            // console.log("down")
        }
        else {
            // console.log()
            t.setVar({y:G.O.floor.y-t.h})
            .setState({down:0})
            .draw();
        }
        
    }
    
    return t

}
G.F.BarriersAI =  function(){

    //move every barrier in the list
    for (var i=0; i < this.barrierList.length;i++){
        var barrier = this.barrierList[i];
        if(barrier){
        if(barrier.delete){//delete the barrier
            barrier.setVar({x:1000}).draw();
            // console.log(typeof barrier,barrier.id);
            //G.deleteGob(barrier.id);
            delete G.O.Barriers.barrierList[i];
            delete G.O[barrier.id];
            this.count -- ;
            // console.log("delete");

            G.O.scoreBoard.S.score ++;
        }
        else{barrier.AI();}}
        
    }
    // console.log(this.count);
    // try to create new barriers
    if (!this.count){
        this.makeBarrier(); //create a barrier when there is no barrier
       
    }
    else {
        var lastB = this.barrierList[this.idCount-1]
        if(lastB){
            if (lastB.x+lastB.w < G.O.viewport.w-lastB.interval){
                this.makeBarrier();
                // console.log(lastB.interval,"interval");
                // console.log(G.S.baseInterval);
                // console.log(random);
                // console.log(random*G.S.baseInterval);
    }}
    else{this.makeBarrier()}
    }
    
    G.S.speed *= 1.0001;
    G.S.jumpSpeed *= 1.0001;

    return this
    
}
G.F.barrierAI = function() {//move or delete
    
    var t = this;
    // console.log(t.y)
    if (t.x < 0-t.w) {
        t.delete = 1;//turn on delete mode if touches the border
    }
    else {
        t.setVar({x:t.x - G.S.speed})// move the barrier if doesn't touch the border
            .draw();
    }
    if(this.checkIntersection(G.O.shelter)){
        this.setVar({x:-100,y:-100})
        .setState({delete:1})
        .draw();
        G.O.shelter.setVar({x:-100})
            .setState({on:0})
            .draw().turnOff();
        G.O.dinosuar.setState({protection:0});
        
        // console.log('hurt')
    }else{if(this.checkCollision(G.O.dinosuar)&&(!G.O.dinosuar.S.protection)){
        G.S.on = 0;
        G.O.startButton.turnOn().draw();
        if(G.O.scoreBoard.S.score>=600){
            msg = "恭喜您获得第35届十大歌手周边一份，请凭借此兑换码截图到线下指定地点兑换奖品" + parse();
            window.alert(msg);
        }
    }}
    
    return t
}
G.F.makeBarrier = function(){ 
    var id = 'barrier'+this.idCount;

    var barrier = G.makeGob(id,G.O.viewport,'IMG')
         .setVar({x:490, y:G.O.floor.y-20, w:20, h:20, AI:G.F.barrierAI})
         .setState({delete:0})
         .setSrc('barrier.bmp')
         .setStyle({margin:0})
         .turnOn();

    barrier.interval = G.F.random()*G.S.baseInterval + G.S.barrierInterval;
    this.barrierList.push(barrier);
    this.count ++;
    this.idCount ++;
}
G.F.rightClickAI = function(){
    var din = G.O.dinosuar
    if(this.tagContainsMouseClick() && !din.S.jump && !din.S.down) {
    din.S.jump = 1;        
    }

}
G.F.leftClickAI = function(){
    var b = G.O.bullet;
    if(this.tagContainsMouseClick() && !b.S.firing){
        b.S.firing = 1;
        //console.log(b.S.firing);
    }
    // if(this.tagContainsMouseClick()){
    //     console.log("click2");
    // }
    
}
G.F.random = function(){
    return Math.floor((Math.random()*15)+1)
    
}
G.F.scoreBoardAI = function(){
    this.setSrc(this.S.msg+this.S.score)
        .draw();
}
G.F.bulletAI = function(){
    if(this.S.firing){
        if(this.x > 500){
            this.S.firing = 0;
        }
        else{
            this.setVar({x:this.x+5})
                .turnOn()
                .draw();
        }
    }
    else{
        if(G.KB.F.isPressed){
            this.S.firing = 1;
        }
        else{
            this.setVar({x:G.O.dinosuar.x+10,y:G.O.dinosuar.y})
                .turnOff()
                .draw();
        }
        
    }
}
G.F.targetAI = function(){
    if (this.checkIntersection(G.O.bullet)){
        // this.turnOff();
        G.O.scoreBoard.S.score += 100;
        G.O.bullet.S.firing = 0;
        if(this.h>20){
            this.setVar({h:this.h/2,w:this.w/2,y:G.S.jumpmax})
            .draw();
        }
        else{
            this.setVar({y:G.F.targetRadom()})
                .draw();
        }
        
    }
}
G.F.targetRadom = function(){
    var x = Math.floor((Math.random())*50+G.S.jumpmax);
    // console.log(x)
    return x
}
G.F.startButtonAI = function(){
    var t = this;
    if(t.tagContainsMouseClick()){
        G.S.on = 1;
        G.F.reset();
        t.turnOff().draw();
        
    }
}
G.F.reset = function(){
    G.O.scoreBoard.S.score = 0;
    G.O.target.setVar({x:G.S.w*5/6,y:G.S.jumpmax,w:20,h:60})
        .draw();

    G.O.dinosuar.setVar({y:G.S.h-80})
        .draw()
        .setState({jump:0, down:0,proteciton:0});
    G.O.bullet.setVar({x:G.O.dinosuar.x+10,y:G.O.dinosuar.y})
                .setState({firing:0})
                .turnOff()
                .draw();
    G.O.shelter.setState({on:0}).turnOff();
    G.setState({ speed:6, jumpSpeed:10});
    G.O.startButton.turnOn().draw();
    for (var i=0; i < G.O.Barriers.barrierList.length;i++){
        var barrier = G.O.Barriers.barrierList[i];
        if(barrier){barrier.turnOff().draw();
            delete G.O.Barriers.barrierList[i];
            delete G.O[barrier.id];}
        
        }
    G.O.Barriers = {
        count: 0,
        idCount: 0,
        barrierList: [],
        makeBarrier: G.F.makeBarrier,
        AI:G.F.BarriersAI
    }
}
parse = function(random=randomstr(),time=new Date().getTime()){
    var msg = " saa";
    var time1,step1,step2
    time1 = time.toString(36).slice(-2)
    step1 = random + msg + time1;
    step2 = window.btoa(step1);
    return time1 + ' ' + random + ' ' + step2;

}
G.F.shelterAI = function(){
    if(this.S.on){
    if(this.checkIntersection(G.O.dinosuar)||this.checkCollision(G.O.bullet)){
        G.O.dinosuar
            .setState({protection:1});
        //this.setState({on:0});

    }
    else{this.setVar({x:this.x-5}).draw();}
    if(G.O.dinosuar.S.protection){
        this.setVar({x:G.O.dinosuar.x,y:G.O.dinosuar.y})
            .draw()
    }
    if(this.x+this.w<0){
        this.setState({on:0})
            .turnOff();
    }

    }
    else{
        if (!(G.O.Barriers.idCount%19)){
            this.setVar({x:G.S.w,y:G.F.targetRadom()})
            .setState({on:1})
            .turnOn()
            .draw();
        }
    }
    // console.log(G.O.Barriers.idCount,!(G.O.Barriers.idCount%3))
}

G.makeBlock('main',G.F.loadMain).loadBlock('main');

//part of present
randomstr = function(){
    return Math.random().toString(36).slice(-2)
}

