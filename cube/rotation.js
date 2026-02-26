step1 = function(num,matrix){
    let newcube = JSON.parse(JSON.stringify(matrix));
       //面变换
    newcube[num][0]=matrix[num][2];
    newcube[num][2]=matrix[num][8];
    newcube[num][8]=matrix[num][6];
    newcube[num][6]=matrix[num][0];

    newcube[num][1]=matrix[num][5];
    newcube[num][5]=matrix[num][7];
    newcube[num][7]=matrix[num][3];
    newcube[num][3]=matrix[num][1];
    return newcube;
}

step2 = function(l1,l2,matrix){
    let newcube = JSON.parse(JSON.stringify(matrix));
       //其他
    for(let i=0;i<3;i++){
        for(let j=0;j<4;j++){
            const n1 = j<3? l1[j+1][i] : l1[0][i];
            let n2 = l2[j];

            let n4 = l1[j][i];
            const n3 = j < 3 ? l2[j+1] : l2[0];
            console.log(j,n2,n3);
            // newcube[j][i]=matrix[j-1][i];
             newcube[n3][n1]=matrix[n2][n4];
        }
    }

    return newcube;
}

rotation0 = function(matrix){
    let newcube = step1(0,matrix);
    //其他面
    newcube = step2([[0,1,2],[0,1,2],[0,1,2],[0,1,2]],[1,2,3,4],newcube);
    console.log(matrix,newcube);
    return newcube;
}

rotation1 = function(matrix){
    let newcube = step1(1,matrix);
    //其他面
    newcube = step2([[0,3,6],[0,3,6],[8,5,2],[0,3,6]],[2,0,4,5],newcube);
    console.log(matrix,newcube);
    return newcube;
}

rotation2 = function(matrix){
    let newcube = step1(2,matrix);
    //其他面
    newcube = step2([[8,5,2],[2,1,0],[0,3,6],[6,7,8]],[1,5,3,0],newcube);
    console.log(matrix,newcube);
    return newcube;
}

rotation3 = function(matrix){
    let newcube = step1(3,matrix);
    //其他面
    newcube = step2([[2,5,8],[2,5,8],[2,5,8],[6,3,0]],[0,2,5,4],newcube);
    console.log(matrix,newcube);
    return newcube;
}
rotation4 = function(matrix){
    let newcube = step1(4,matrix);
    //其他面
    newcube = step2([[6,7,8],[0,3,6],[2,1,0],[8,5,2]],[5,1,0,3],newcube);
    console.log(matrix,newcube);
    return newcube;
}
rotation5 = function(matrix){
    let newcube = step1(5,matrix);
    //其他面
    newcube = step2([[6,7,8],[6,7,8],[6,7,8],[6,7,8]],[4,3,2,1],newcube);
    console.log(matrix,newcube);
    return newcube;
}