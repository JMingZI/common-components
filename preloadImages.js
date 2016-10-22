preloadimages: function(arr){
    var newimages=[];
    var errorInfo = [];
    for (var i = 0; i<arr.length; i++){
        newimages[i] = new Image();
        newimages[i].src = arr[i];
        newimages[i].onload = function(){}
        newimages[i].onerror = function(i){
            errorInfo.push(arr[i] + "加载失败！");
        }
    }
    return {
        done: function(f){
            f && f(errorInfo);
        }
    }
}
