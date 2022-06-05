G.F.loadMain = function(){

    this.AI = G.F.mainAI;

    G.KB.addKeys("UP","F");

    G.setState({barrierInterval:130, speed:6, jumpSpeed:10, baseInterval:10,on:1});

    G.makeGob('viewport',G)
        .setVar({x:50, y:50, w:500, h: 400})
        .setStyle({backgroundColor:"#FFF000"})
        .turnOn();

    G.makeGob('bullet',G.O.viewport)
    .setVar({x:50,y:320,w:15,h:5,AI:G.F.bulletAI})
    .setStyle({backgroundColor:"#FFFFFF"})
    .setState({firing:0})
    .turnOn();

    G.makeGob('dinosuar',G.O.viewport,"IMG")
        .setVar({x:50, y:320, w:40, h:50,AI:G.F.dinosuarAI})
        .setStyle({margin:0})
        .setSrc("dinosuar.bmp")
        .setState({jump:0, down:0})
        .turnOn();
    
    G.makeGob('floor',G.O.viewport)
        .setVar({x:0, y:370, h:5, w:500})
        .setStyle({backgroundColor:"#333999"})
        .turnOn();
    
    G.makeGob('rightClick',G.O.viewport)
        .setVar({x:0,y:0,w:250,h:400,AI:G.F.rightClickAI})
        .turnOn();

    G.makeGob("leftClick",G.O.viewport)
    .setVar({x:250,y:0,w:250,h:400,AI:G.F.leftClickAI})
    .turnOn();

    //define a class to handle barriers
    G.O.Barriers = {
        count: 0,
        idCount: 0,
        barrierList: [],
        makeBarrier: G.F.makeBarrier,
        AI:G.F.BarriersAI
    }
    
    G.makeGob('scoreBoard',G.O.viewport)
        .setVar({x:50, y:0,w:200,h:60,AI:G.F.scoreBoardAI})
        .setSrc('Score:')
        .setState({msg:"SCORE:",score:0})
        .setStyle({color:"#000000"})
        .turnOn()
    
    G.makeGob('target',G.O.viewport,"IMG")
        .setVar({x:300,y:170,w:20,h:60,AI:G.F.targetAI})
        .setSrc('target.png')
        .turnOn();
}
G.F.mainAI = function(){
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
    }
}
G.F.dinosuarAI = function(){
    //console.log("dinosuar");
    var t = this;

    //turn on jump mod if UP pessed
    if(G.KB.keys.UP.isPressed && !t.S.jump && !t.S.down) {
        t.S.jump = 1;
        
    }

    //jump if in jump mod
    if(t.S.jump) {
        if (t.y > 150) {
            t.setVar({y:t.y-G.S.jumpSpeed}).draw();
        }
        else {
            t.S.down = 1;
            t.S.jump = 0;
        }
    }

    //go down if in down mod
    if(t.S.down) {
        if(t.y < 320) {
            t.setVar({y:t.y+G.S.jumpSpeed}).draw();
            // console.log("down")
        }
        else {
            t.S.down = 0;
        }
    }
    // console.log("down",t.down);
    // console.log("jump",t.jump)
    return t

}
G.F.BarriersAI =  function(){

    //move every barrier in the list
    for (var i=0; i < this.barrierList.length;i++){
        var barrier = this.barrierList[i];
        if(barrier){
        if(barrier.delete){//delete the barrier
            barrier.setVar({x:1000}).draw();
            console.log(typeof barrier,barrier.id);
            //G.deleteGob(barrier.id);
            delete G.O.Barriers.barrierList[i];
            delete G.O[barrier.id];
            this.count -- ;
            console.log("delete");

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
                console.log(lastB.interval,"interval");
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

    if (t.x < 0-t.w) {
        t.delete = 1;//turn on delete mode if touches the border
    }
    else {
        t.setVar({x:t.x - G.S.speed})// move the barrier if doesn't touch the border
            .draw();
    }

    if(this.checkIntersection(G.O.dinosuar)){
        window.alert("game over,flash to try again");
        G.S.on = 0;
    }
    return t
}
G.F.makeBarrier = function(){ 
    var id = 'barrier'+this.idCount;

    var barrier = G.makeGob(id,G.O.viewport,'IMG')
         .setVar({x:490, y:340, w:30, h:30, AI:G.F.barrierAI})
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
    if(this.tagContainsMouseClick())console.log("click");

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
            this.setVar({h:this.h/2,w:this.w/2})
            .draw();
        }
        else{
            this.setVar({y:G.F.targetRadom()})
                .draw();
        }
        
    }
}
G.F.targetRadom = function(){
    var x = (Math.random())*100+150;
    return x
}
G.makeBlock('main',G.F.loadMain).loadBlock('main');
