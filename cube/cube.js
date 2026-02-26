let Cube = {};

Cube.reset = function(){
    this.data = [
        [0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1],
        [2,2,2,2,2,2,2,2,2],
        [3,3,3,3,3,3,3,3,3],
        [4,4,4,4,4,4,4,4,4],
    [5,5,5,5,5,5,5,5,5]];
    return this
};

Cube.rotation = function(num){
    switch(num){
        case 0:
            this.data = rotation0(this.data);
            this.display();
            break;
        case 1:
            this.data = rotation1(this.data);
            break;
        case 2:
            this.data = rotation2(this.data);
            break;
        case 3:
            this.data = rotation3(this.data);
            break;
        case 4:
            this.data = rotation4(this.data);
            break;
        case 5:
            this.data = rotation5(this.data);
            break;
    }
};

Cube.display = function(){
    console.log(this.data);
}

Cube.reset();